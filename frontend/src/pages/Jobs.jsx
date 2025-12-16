import React, { useEffect, useState } from "react";
import API from "../api";
import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  async function loadJobs() {
    const res = await API.get("/jobs/");
    setJobs(res.data);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="container">
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

export default Jobs;
