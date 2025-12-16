import React from "react";

function JobCard({ job }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <p><b>Wage:</b> Rs. {job.wage}</p>
    </div>
  );
}

export default JobCard;
