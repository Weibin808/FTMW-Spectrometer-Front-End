import { React, useRef, useState } from "react";
import { useReactToPrint} from "react-to-print";
import { RadioGroup, FormControl, FormControlLabel, Radio } from "@mui/material";

import {Experiment2} from "../routes/Experiment2";
import {Plotly} from "./Plotly2";
import "../style/App.css";

export default function Print() {

  const componentRef = useRef();
  const [printOptions, setPrintOptions] = useState("both");

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const onSelect = (event) => {
    setPrintOptions(event.target.value);
  }

  return(
    <div>
      <h1>Print</h1>
      <h3>Would you like to print</h3>
      <FormControl>
        <RadioGroup
          aria-labelledby="print-selection"
          defaultValue="female"
          name="radio-buttons-group"
          row
          value={printOptions}
          onChange={onSelect}
        >
          <FormControlLabel value="graph" control={<Radio />} label="Just the Graph" />
          {/* <FormControlLabel value="input" control={<Radio />} label="Just the Inputs" /> */}
          <FormControlLabel value="both" control={<Radio />} label="Both the Graph and Inputs" />
        </RadioGroup>
      </FormControl>

      <button className="button" onClick={handlePrint}>Click</button>

      <div style={{display: "none"}}>
        {printOptions === "graph" && <Plotly ref={componentRef} />}
        
        {printOptions === "both" && <Experiment2 ref={componentRef} />}
      </div>
    </div>
  );

}