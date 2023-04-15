import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './Classifier.css';
import { Alert, Button, Image, Spinner, Form, FormControl, ProgressBar } from 'react-bootstrap';
import axios from 'axios'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getReqUrlAddress } from '../GetUrl/GetUrl';

class Classifier extends Component {
  constructor(props) {
    super(props);  
    this.state = {
        files: [],
        isLoading: false,
        isAnalyzing: false,
        recentImage: null,
        previewImage: null,
        e_hr: '', // add state variable for e_hr
        e_min: '', // add state variable for e_min
        showMessage: false,
        isMultipleimages: false,
        showProcessedImage: false,
        analyzedInfo: null,
        dropzoneDimensions: {
          width: 0,
          height: 0,
        },
      };
      this.dropzoneRef = React.createRef();
    }
    componentDidMount() {
      // Add a resize event listener to the window
      window.addEventListener('resize', this.handleResize);
      // Get the initial dimensions of the dropzone
      const { width, height } = this.dropzoneRef.current.getBoundingClientRect();
      this.setState({ dropzoneDimensions: { width, height } });
    }
  
    componentWillUnmount() {
      // Remove the resize event listener when the component unmounts
      window.removeEventListener('resize', this.handleResize);
    }
  
    handleResize = () => {
      // Update the dimensions of the dropzone when the window resizes
      const { width, height } = this.dropzoneRef.current.getBoundingClientRect();
      this.setState({ dropzoneDimensions: { width, height } });
    };

    // event handler for e_hr input field
    handleEhrChange = (event) => {
        this.setState({ e_hr: event.target.value });
    }

    // event handler for e_min input field
    handleEminChange = (event) => {
        this.setState({ e_min: event.target.value });
    }

    onDrop = (files) => {
        if (files.length > 1) {
            this.setState({ isMultipleimages: true });
            return;
        }
        this.setState({
            isLoading: true,
            files: [],
            recentImage: null,
            previewImage: files[0],
            isMultipleimages: false, // Reset the state when a single image is uploaded
        })
        this.loadingImage(files)
    }

    loadingImage = (files) => {
        setTimeout(() => {
            this.setState({
                files,
                isLoading: false,
                showProcessedImage: false
            }, () => {
                console.log(this.state.files[0].name)
            })
        }, 1000);
    }
    analyzingImage = () => {
        setTimeout(() => {
            this.setState({
                isAnalyzing: false
            }, () => {
                console.log(this.state.files[0].name)
            })
        }, 1000);
    }
    activateSpinner = () => {
        this.setState({
            isLoading: true,
            isAnalyzing: true,
            files: []
        })
    }

    deactivateSpinner = () => {
        this.setState({
            isLoading: false,
            isAnalyzing: false,
        })
    }

    handleDisabledClick = () => {
        this.setState({ showMessage: true });
        // setTimeout(() => {
        //     this.setState({ showMessage: false });
        // }, 1000); // Show the message for 3 seconds
    }

    sendImage = () => {
      this.setState({
        isLoading: false,
        isAnalyzing: true,
        files: []
      });
      let formData = new FormData();
      formData.append('image', this.state.files[0], this.state.files[0].name);
      formData.append('e_hr', this.state.e_hr); // add e_hr data to FormData
      formData.append('e_min', this.state.e_min); // add e_min data to FormData
      getReqUrlAddress().then(ipAddress => {
        axios.post(`${ipAddress}/api/images/`, formData, {
          headers: {
            'accept': 'application/json',
            'content-type': 'multipart/form-data',
          },
        })
          .then(resp => {
            this.getImageResults(resp);
            console.log(resp.data);
          })
          .catch(err => {
            console.log('Error Message here: ' + err);
          });
      });
    }
    
    getImageResults = (object) => {
      getReqUrlAddress().then(ipAddress => {
        axios.get(`${ipAddress}/api/images/${object.data.id}/`, {
          headers: {
            'accept': 'application/json',
          },
        })
          .then(resp => {
            this.setState({ recentImage: resp, analyzedInfo: resp.data.analyzed_info });
            console.log(resp);
          })
          .catch(err => {
            console.log('Error Message here: ' + err);
          });
        this.deactivateSpinner();
      });
    }
    
    showProcessedImage = async () => {
      const ipAddress = await getReqUrlAddress();
      axios.get(`${ipAddress}${this.state.recentImage.data.processed_image}`, {
        headers: {
          'accept': 'image/png, image/jpeg',
        },
        responseType: 'blob',
      })
        .then(resp => {
          this.getImageResults(resp);
          console.log(resp.data);
          this.setState({ showProcessedImage: false }); // Add this line to hide the processed image initially
        })
        .catch(err => {
          console.log('Error Message here: ' + err);
        });
      this.setState({ showProcessedImage: true });
    }
    

    hideProcessedImage = () => {
        this.setState({ showProcessedImage: false });
    }

    render() {
      const { dropzoneDimensions } = this.state;
      let imageBoxStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '250px',
        border: '2px dashed #ccc',
      };
      let imageStyle = {
        maxWidth: `${dropzoneDimensions.width * 0.99}px`,
        maxHeight: `${dropzoneDimensions.height * 0.9}px`,
        objectFit: 'contain',
      };
      let dropzoneStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: `${dropzoneDimensions.width}px`,
        height: `${dropzoneDimensions}px`,
      };
    
      const files = this.state.files.map((file) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <li key={file.name} style={{ margin: 'auto' }}>
            {file.name} - {file.size} bytes
          </li>
        </div>
      ));
    
      return (
    <React.Fragment>
      {this.state.recentImage === null && (
        <div ref={this.dropzoneRef} style={imageBoxStyle}>
          <div className="image-preview" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {this.state.previewImage ? (
              <img src={URL.createObjectURL(this.state.previewImage)} alt="" style={imageStyle} />
            ) : (
              <Dropzone onDrop={this.onDrop} accept="image/png, image/jpeg">
                {({ isDragActive, getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: 'dropzone back' })} style={{ ...dropzoneStyle, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <input {...getInputProps()} />
                    <i className="fa fa-cloud-upload fa-4x text-muted" style={{ fontSize: 120 }}></i>
                    <p className="text-muted">{isDragActive ? 'Drop some images' : "Drag 'n' drop some files here, or click to select files"}</p>
                  </div>
                )}
              </Dropzone>
            )}
          </div>
        </div>
      )}
              <Form>
                {this.state.recentImage ? null : (
                  <React.Fragment>
                <div className="row justify-content-center" style={{ marginTop: '5px' }}>
                  <label htmlFor="exposure_time" className="col-form-label">
                    Exposure Time
                  </label>
                <div className="col-sm-2 col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder=""
                    id="exposure_hour"
                    name="e_hr"
                    value={this.state.e_hr}
                    onChange={this.handleEhrChange}
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>
                <label htmlFor="exposure_hour" className="col-form-label">
                  h
                </label>
                <div className="col-sm-2 col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder=""
                    id="exposure_min"
                    name="e_min"
                    value={this.state.e_min}
                    onChange={this.handleEminChange}
                    min="0"
                    style={{ width: '100%' }}
                  />
                </div>
                <label htmlFor="exposure_min" className="col-form-label">
                  m
                </label>
              </div>
                  </React.Fragment>
                )}
              </Form>

                {this.state.files.length > 0 && (
                  (this.state.e_hr !== "" && this.state.e_min !== "")  && (parseInt(this.state.e_hr) >= 0 && parseInt(this.state.e_min) >= 0) && (parseInt(this.state.e_hr) !== 0 || parseInt(this.state.e_min) !== 0) ? (
                    <Button variant="info" size="lg" className="mt-3" onClick={this.sendImage}>Analyze</Button>
                  ) : (
                    <Button variant="info" size="lg" className="mt-3" onClick={this.handleDisabledClick}>Analyze</Button>
                  )
                )}
                {this.state.showMessage && (this.state.e_hr === "" || this.state.e_min === "") &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please fill in both 'Exposure Hour' and 'Exposure Minute' fields.</Alert>
                }
                {this.state.showMessage && (parseInt(this.state.e_hr) === 0 && parseInt(this.state.e_min) === 0) &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>At least one of them should be 1 or greater.</Alert>
                }
                {this.state.showMessage && (parseInt(this.state.e_hr) < 0 || parseInt(this.state.e_min) < 0) &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please enter only non-negative values for 'Exposure Hour' and 'Exposure Minute'.</Alert>
                }
                {this.state.isMultipleimages &&
                    <Alert variant='warning' style={{ marginTop: '13px' }}>Please upload only one image at a time.</Alert>
                }
                {this.state.isLoading &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '50px' }} />
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>Loading...</div>
                    </div>
                }
                {this.state.isAnalyzing &&
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '50px' }} />
                        <div style={{ textAlign: 'center', marginTop: '5px' }}>Analyzing...</div>
                    </div>
                }
                {this.state.recentImage &&
                  <React.Fragment>
                    {this.state.recentImage.data.analyzed.includes('Failed') && 
                        <Alert variant='warning' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">{this.state.recentImage.data.analyzed}</div>
                        </Alert>
                    }
                    {!this.state.recentImage.data.analyzed.includes('Failed') && Number(this.state.recentImage.data.analyzed) <= 100 ? (
                        <Alert variant='primary' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level<br></br><b>{Math.round(this.state.recentImage.data.analyzed)}</b> ppb</div>
                        </Alert>
                    ) : !this.state.recentImage.data.analyzed.includes('Failed') && (
                        <Alert variant='danger' style={{ marginTop: '12px'}}>
                            <div className="auto-line-break analyzed-results">Ozone exposure level<br></br> <b>{Math.round(this.state.recentImage.data.analyzed)}</b> ppb</div>
                        </Alert>
                    )}
                    {!this.state.recentImage.data.analyzed.includes('Failed') && 
                        <div className="circular-progress-bar" style={{marginTop: '13px !important'}}>
                          <CircularProgressbar
                            value={Number(this.state.recentImage.data.analyzed)}
                            text={
                              Number(this.state.recentImage.data.analyzed) <= 100 ? 'SAFE' : 'DANGER'
                            }
                            styles={buildStyles({
                              fontSize: '14px',
                              textColor: Number(this.state.recentImage.data.analyzed) <= 100 ? '#007bff' : '#dc3545',
                              pathColor: Number(this.state.recentImage.data.analyzed) <= 100 ? '#007bff' : '#dc3545',
                              trailColor: '#f2f2f2',
                            })}
                          >
                          </CircularProgressbar>
                        </div>
                    }
                  </React.Fragment>
                    }
          </React.Fragment>
        );
      }
}

export default Classifier;


// <div className="image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
// {this.state.recentImage && (
//   <React.Fragment>
//     {this.state.showProcessedImage ? (
//       <React.Fragment>                      
//         <Button style={{ marginTop: '0px', marginBottom: '30px', fontSize: '15px', width: '220px', height: '40px' }} variant="primary" size="lg" className="mt-3 mx-auto" onClick={this.hideProcessedImage}>Hide Processed Image</Button>
//         <div style={{border: '2px solid #ccc', borderRadius: '4px',padding: '3px',marginTop: '0px', marginBottom: '30px'}}>
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><b style={{ color: 'gray' ,fontStyle: 'italic'}}>Processed Data</b>
//             <Image
//               className='justify-content-center'
//               src={this.state.recentImage.data.processed_image}
//               height='300'
//               alt="File not Loaded"
//               rounded
//               align="center"
//               style={{ marginTop: '0px', marginBottom: '7px' }}
//             />
//             <div className="analyzed-info-container">
//                 {this.state.analyzedInfo && (
//                   <div className="analyzed-info auto-line-break" style={{ marginBottom: '0px !important' }}>
//                     <b style={{ color: 'gray' ,fontStyle: 'italic'}}><p>{this.state.analyzedInfo}</p></b>
//                   </div>
//                 )}
//             </div>
//           </div>
//         </div>
//       </React.Fragment>
//     ) : (
//       <Button style={{ marginTop: '0px', marginBottom: '30px', fontSize: '15px', width: '220px', height: '40px' }} variant="primary" size="lg" className="mt-3 mx-auto" onClick={this.showProcessedImage}>Show Processed Image</Button>
//     )}
//   </React.Fragment>
// )}
// </div> 
// show process image part

// This error is caused by running out of the inotify watches limit. You can fix it by increasing the inotify limit.

// You can try running the following command to temporarily increase the limit:

// Copy code
// sudo sysctl fs.inotify.max_user_watches=524288
// If this works, you can make the change permanent by adding the following line to the end of the /etc/sysctl.conf file:

// Copy code
// fs.inotify.max_user_watches=524288
// Then, save the file and run the following command to apply the changes:


// sudo sysctl -p
// After this, you should be able to run npm start without encountering the ENOSPC error.