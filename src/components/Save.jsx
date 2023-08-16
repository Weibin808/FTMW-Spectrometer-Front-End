import { useState } from "react";

// components
import CloseButton from "./CloseButton.jsx";

// mui
import { Dialog } from "@mui/material";

// redux
import { useSelector } from "react-redux";

// helper function
import { generateTransmittance } from "../dictionaries/dataFunctions";

// style
import "../style/components/Button.css";
import "../style/components/Save.css";

/**
 * A component that is used to save a CSV file of X and Y coordinates and the user parameters that generated that data.
 */
export default function Save() {
  const {
    beamsplitter,
    detector,
    medium,
    molecule,
    pressure,
    resolution,
    scan,
    source,
    waveMax,
    waveMin,
    window,
    zeroFill,
  } = useSelector((store) => store.parameter);

  const { absorbanceData } = useSelector((store) => store.absorbanceData);
  const { backgroundData } = useSelector((store) => store.backgroundData);
  // const { peaksData } = useSelector((store) => store.peaksData);
  const { sampleData } = useSelector((store) => store.sampleData);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const print = (spectrumType) => {
    let spectrumData = "";

    if (spectrumType.localeCompare("sample") === 0) {
      spectrumData = sampleData;
    } else if (spectrumType.localeCompare("background") === 0) {
      spectrumData = backgroundData;
    } else if (spectrumType.localeCompare("absorbance") === 0) {
      spectrumData = absorbanceData;
    } else if (spectrumType.localeCompare("transmittance") === 0) {
      spectrumData = generateTransmittance(backgroundData, sampleData);
    } else {
      return;
    }

    if (spectrumType.localeCompare("peaks") === 0) {
    } else {
    }

    let printData = `Spectrum details | Min Wavenumber: ${waveMin} Max Wavenumber: ${waveMax} Molecule: ${molecule} Pressure: ${pressure} Resolution: ${resolution} Number of Scans: ${scan} Zero Fill: ${zeroFill} Source: ${source} Beamsplitter: ${beamsplitter} Cell Window: ${window} Detector: ${detector} Medium: ${medium} \n`;
    printData += `${
      spectrumType.charAt(0).toUpperCase() + spectrumType.slice(1)
    } Spectrum\n`;

    for (let i = 0; i < spectrumData.x.length; i++) {
      printData += `${spectrumData.x[i]}, ${spectrumData.y[i]}\n`;
    }

    const element = document.createElement("a");
    const file = new Blob([printData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${spectrumType} data.csv`;
    document.body.appendChild(element);
    element.click();
  };

  // const peaksCSV = () => {
  //   let newData = [];

  //   for (const [peak, intensity] of Object.entries(peaksData.peaks)) {
  //     newData.push([peak, intensity]);
  //   }

  //   setData(newData);
  //   setFilename("peaks data.csv");
  //   setTimeout(() => {
  //     csvLink.current.link.click();
  //   }, 500);
  // };

  return (
    <div>
      <button className="popup-button dropdown-items" onClick={handleClickOpen}>
        Save
      </button>
      <Dialog className="popup" onClose={handleClose} open={open}>
        <CloseButton id="customized-dialog-title" onClose={handleClose} />

        <h2>Save Data</h2>

        {(sampleData || backgroundData) && (
          <h3>What data would you like to save?</h3>
        )}

        {!sampleData && !backgroundData && (
          <h3>There is currently no data to save</h3>
        )}

        <div className="save-col">
          {sampleData && (
            <>
              <button
                className="button"
                onClick={() => {
                  print("sample");
                }}
              >
                Sample Spectrum Data
              </button>
            </>
          )}

          {backgroundData && (
            <button
              className="button"
              onClick={() => {
                print("background");
              }}
            >
              Background Spectrum Data
            </button>
          )}

          {sampleData && backgroundData && (
            <button
              className="button"
              onClick={() => {
                print("transmittance");
              }}
            >
              Transmittance Spectrum Data
            </button>
          )}

          {absorbanceData && (
            <button
              className="button"
              onClick={() => {
                print("absorbance");
              }}
            >
              Absorbance Spectrum Data
            </button>
          )}

          {/* {peaksData && (
            <button className="button" onClick={peaksCSV}>
              Peaks Data
            </button>
          )} */}
        </div>
      </Dialog>
    </div>
  );
}
