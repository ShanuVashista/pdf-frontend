import React, { useRef } from "react";
import Pdf from "react-to-pdf";

const SignPdf = (props) => {
  const ref = useRef();
  return (
    <>
      <div className="Post" ref={ref}>
        <h1>{props.title}</h1>
        <img src={props.image} alt={props.title} />
        <p>{props.content}</p>
      </div>
      <Pdf targetRef={ref} filename="post.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Capture as PDF</button>}
      </Pdf>
    </>
  );
};

export default SignPdf;
