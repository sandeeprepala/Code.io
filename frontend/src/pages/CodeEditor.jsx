import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/CodeEditor.css";
import Popup from "../components/Popup";
import { toast } from 'react-hot-toast';



const languageOptions = {
    javascript: { id: 63, label: "JavaScript" },
    python: { id: 92, label: "Python" },
    cpp: { id: 54, label: "C++" },
    java: { id: 62, label: "Java" },
};

const defaultCodes = {
    javascript: "// Write your JavaScript code here",
    python: "# Write your Python code here",
    cpp: "// Write your C++ code here",
    java: "// Write your Java code here",
};


const CodeEditor = ({ testCases = [], problemId }) => {
    const [code, setCode] = useState(defaultCodes["javascript"]);
    const [selectedLang, setSelectedLang] = useState("javascript");
    const [results, setResults] = useState([]);
    const [verdict, setVerdict] = useState("");

    const handleLangChange = (e) => {
        const newLang = e.target.value;
        setSelectedLang(newLang);
        setCode(defaultCodes[newLang]);
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const addProblemToUser = async (problemId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/problems/solved`,
                { problemId },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },


                }
            );
        } catch (error) {
            console.error(error);
        }
    }


    const runAllTestCases = async () => {
        const languageId = languageOptions[selectedLang].id;
        const runPromises = testCases.map(async ({ input, output: expected }) => {
            try {
                const { data } = await axios.post(
                    "https://judge0-ce.p.rapidapi.com/submissions",
                    {
                        source_code: code,
                        language_id: languageId,
                        stdin: input,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-RapidAPI-Key": "61ef607dfdmshac4f40b4c812d61p1956a5jsn4d082bec6041",
                            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                        },
                    }
                );

                const token = data.token;
                await new Promise((resolve) => setTimeout(resolve, 1500));

                const result = await axios.get(
                    `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
                    {
                        headers: {
                            "X-RapidAPI-Key": "61ef607dfdmshac4f40b4c812d61p1956a5jsn4d082bec6041",
                            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                        },
                    }
                );

                const actualOutput = result.data.stdout?.trim();
                const passed = actualOutput === expected.trim();
                return { input, expected, actual: actualOutput, passed };
            } catch (err) {
                console.log(err)
                return { input, expected, actual: "Error", passed: false };
            }
        });
        const toastId = toast.loading("⏳ Submitting your code...");
        const allResults = await Promise.all(runPromises);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
        setResults(allResults);

        const allPassed = allResults.every((r) => r.passed);
        if (allPassed) {
            setVerdict("✅ All Visible and Hidden test cases passed!");
            toast.success("✅ All test cases passed!", { id: toastId });
            addProblemToUser(problemId);
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/submissions`, {
                problemId,
                code,
                language: selectedLang,
                verdict: allPassed ? "Accepted" : "Wrong Answer",
                passedTestCases: allResults.filter(r => r.passed).length,
                totalTestCases: allResults.length,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                }
                
            });
        } else {
            toast.error("❌ Something went wrong!", { id: toastId });
            setVerdict("❌ Some Visible or Hidden test cases failed.");
        }
    };
    
    return (
        
        <div className="editor-container">
            <div className="editor-toolbar">
                <label className="language-label">Select Language:</label>
                <select
                    className="language-selector"
                    value={selectedLang}
                    onChange={handleLangChange}
                >
                    {Object.keys(languageOptions).map((lang) => (
                        <option key={lang} value={lang}>
                            {languageOptions[lang].label}
                        </option>
                    ))}
                </select>
            </div>

            <Editor
                height="60vh"
                width="100%"
                language={selectedLang}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
            />

            <button className="run-button" onClick={runAllTestCases}>
                Submit
            </button>

            <div className="verdict">{verdict}</div>

            <div className="test-results">
                {results.map((r, idx) => (
                    <div key={idx} className={`test-case ${r.passed ? "pass" : "fail"}`}>
                        <p><strong>Input:</strong> {r.input}</p>
                        <p><strong>Expected:</strong> {r.expected}</p>
                        <p><strong>Output:</strong> {r.actual}</p>
                        <p><strong>Status:</strong> {r.passed ? "✅ Passed" : "❌ Failed"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodeEditor;
