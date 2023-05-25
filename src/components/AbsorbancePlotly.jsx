import React, { forwardRef, useState } from "react";
import { useSelector } from "react-redux";

// components
import Plot from "react-plotly.js";
import { Dialog } from "@mui/material";

// style
import "../style/components/Plotly.css";
import FetchPeaks from "./FetchPeaks";

// this component uses the plotly library to graph processed spectrum data
export const AbsorbancePlotly = forwardRef((props, ref) => {
  const spectrumData = useSelector((state) => state.spectrumData);
  const backgroundData = useSelector((state) => state.backgroundData);
  const peaks = useSelector((state) => state.peaks);
  const params = useSelector((state) => state.params);

  const [open, setOpen] = useState(false);

  const newY = [spectrumData.x.length];

  for (let i = 0; i < spectrumData.x.length; i++) {
    newY[i] = -1 * Math.log(spectrumData.y[i] / backgroundData.y[i]);
  }

  if (spectrumData) {
    // https://github.com/suzil/radis-app/blob/main/frontend/src/components/CalcSpectrumPlot.tsx
    return (
      <>
        <Plot
          ref={ref}
          className="plotly"
          data={[
            {
              x: spectrumData.x,
              y: newY,
              type: "scatter",
              marker: { color: "#f50057" },
            },
          ]}
          layout={{
            title: "Absorbance Spectrum",
            font: { family: "Roboto", color: "#000" },
            xaxis: {
              range: [params.minWave, params.maxWave],
              title: { text: "Wavenumber (cm⁻¹)" },
              rangeslider: {
                autorange: true,
                yaxis: { rangemode: "auto" },
              },
              type: "linear",
            },
            yaxis: {
              autorange: true,
              title: {
                text: "Signal",
              },
              type: "linear",
              fixedrange: false,
              // https://community.plotly.com/t/how-to-hide-axis-ticktexts-but-remain-axis-tilte/10839/2
              showticklabels: false,
            },
          }}
          // https://community.plotly.com/t/react-plotly-responsive-chart-not-working/47547
          useResizeHandler={true}
        />

        <FetchPeaks 
          type="find_peaks"
          params={{
            x: spectrumData.x,
            y: newY
          }}
          fetchURL={"http://localhost:5000/find_peaks"} // TODO: Add api url
          buttonText={"Find Peaks"}
          openPopup={setOpen}
        />
        
        <Dialog
          className="popup"
          onClose={() => {
            setOpen(false);
          }}
          open={open}
        >
          <h1>Absorbance Peaks</h1>
          {/* NOTE: cannot open absorbance tab while this code is there and peaks is null */}
          { 
            peaks.peaks.map((peak) => {
              return (
                <p>{peak}</p>
              );
            })
          }
          { 
            peaks.intensity.map((peak) => {
              return (
                <p>{peak}</p>
              );
            })
          }
        </Dialog>

      </>
    );
  } else {
    return <div></div>;
  }
});
