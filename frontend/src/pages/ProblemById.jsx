import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProblemById.css';
import CodeEditor from './CodeEditor';
import toast, { Toaster } from 'react-hot-toast';


const ProblemById = () => {

    const { id } = useParams();
    const [problemId, setProblemId] = useState(id);
    const [problem, setProblem] = useState(null);
    const [solved, setSolved] = useState(false);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });



        const fetchProblem = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/problems/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProblem(response.data.data);
                setSolved(response.data.data.solved || false); // ✅ This line sets the solved flag
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };

        fetchProblem();
    }, [id]);

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/submissions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Submissions:', response.data.data);
            setSubmissions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch submissions', error);
        }
    };
    if (!problem) return <div className="loading">Loading...</div>;

    return (
        <div className='main'>
            <div className='left'>
                <h2 className='problem-title'>{problem.title}</h2>
                {solved && <p className='solved'>✅solved</p>}
                
                <button onClick={fetchSubmissions}>Submissions</button>
                <span className={`difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
                <p className='problem-description'>{problem.description}</p>
                <div className='topics'>
                    {problem.topics.map((tag, index) => (
                        <span className='topic-tag' key={index}>{tag}</span>
                    ))}
                </div>
                <div className='examples'>
                    <h3>Example Test Cases:</h3>
                    {problem.exampleTests.map((test, index) => (
                        <div className='test-case' key={index}>
                            <pre><strong>Input:</strong> {test.input}</pre>
                            <pre><strong>Output:</strong> {test.output}</pre>
                        </div>
                    ))}
                </div>
                <div>
                    {submissions.length === 0 ? (
      <p>No submissions yet.</p>
    ) : (
      submissions.map((submission, idx) => (
        <div key={idx} className="submission-card">
          <p><strong>Status:</strong> {submission.verdict}</p>
          <p><strong>Language:</strong> {submission.language}</p>
          <p><strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
          <pre className="code-preview">{submission.code}</pre>
        </div>
      ))
    )}
                </div>
            </div>
                    
            <div className="right">
                <CodeEditor testCases={[...problem.exampleTests, ...problem.hiddenTests]} problemId={problemId} />
            </div>
        </div>
    );
};

export default ProblemById;
