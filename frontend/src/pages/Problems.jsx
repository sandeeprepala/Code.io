import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Problems.css";
import { useNavigate } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [allTopics, setAllTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [solvedFilteredProblems, setSolvedFilteredProblems] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/problems`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        );
        setProblems(response.data.data.problems);
        setFilteredProblems(response.data.data.problems);
        console.log(response.data.data.solvedProblems);
        setSolvedProblems(response.data.data.solvedProblems || []);
        extractTopics(response.data.data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const extractTopics = (problems) => {
    const topicsSet = new Set();
    problems.forEach((problem) => {
      problem.topics.forEach((topic) => topicsSet.add(topic));
    });
    setAllTopics(Array.from(topicsSet));
  };

  useEffect(() => {
    let temp = [...problems];

    if (selectedDifficulty) {
      temp = temp.filter((p) => p.difficulty === selectedDifficulty);
    }

    if (selectedTopic) {
      temp = temp.filter((p) => p.topics.includes(selectedTopic));
    }

    if (searchTerm) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (solvedFilteredProblems) {
      temp = temp.filter((p) => solvedProblems.includes(p._id));
    }

    setFilteredProblems(temp);
  }, [selectedDifficulty, selectedTopic, searchTerm, solvedFilteredProblems, problems]);

  return (
    <div className="problems-container">
      <h2>Master DSA With Code.io</h2>

      <input
        type="text"
        placeholder="Search by title..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filters">
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <div
        className={`filter ${solvedFilteredProblems ? "active" : "not"}`}
        onClick={() => setSolvedFilteredProblems(prev => !prev)}
      >
        {solvedFilteredProblems ? "Show All" : "Solved"}
      </div>

      <div className="topic-tags">
        {allTopics.map((topic) => (
          <div
            key={topic}
            className={`topic-tag ${selectedTopic === topic ? "active" : ""}`}
            onClick={() =>
              setSelectedTopic((prev) => (prev === topic ? "" : topic))
            }
          >
            {topic}
          </div>
        ))}
      </div>

      {(selectedDifficulty || selectedTopic || searchTerm || solvedFilteredProblems) && (
        <div
          className="clear-filter"
          onClick={() => {
            setSelectedDifficulty("");
            setSelectedTopic("");
            setSearchTerm("");
          }}
        >
          Clear Filters
        </div>
      )}

      <div className="problems-list">
        {filteredProblems.map((problem) => (
          <div
            key={problem._id}
            className="problem-card"
            onClick={() => navigate(`/problems/${problem._id}`)}
          >
            <div className="card-footer">
              <div className="problem-header">
                <h3>{problem.title}</h3>
                <div className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </div>

              </div>
              <div>
                {solvedProblems.includes(problem._id) && (
                  <span className="solved-badge">✅ Solved</span>
                )}
              </div>
            </div>


            <div className="tags">
              {problem.topics.map((tag, index) => (
                <span className="tag" key={index}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problems;
