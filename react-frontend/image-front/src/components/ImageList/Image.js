import React from 'react';

const Image = (props) => {
    return (
        <div className="image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <div style={{border: '2px solid #ccc', borderRadius: '4px',padding: '3px',marginTop: '0px', marginBottom: '3px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <b style={{ color: 'gray' ,fontStyle: 'italic'}}>Processed  Image Data #{props.id}</b>
                    <img
                        className='justify-content-center'
                        src={props.pict}
                        height='300'
                        rounded
                        align="center"
                        style={{ marginTop: '0px', marginBottom: '7px' }}
                    />
                    <div className="analyzed-info-container">
                        {props.analyzedInfo && (
                            <div className="analyzed-info auto-line-break" style={{ marginBottom: '0px !important' }}>
                                <b style={{ color: 'gray' ,fontStyle: 'italic'}}><p>{props.analyzedInfo}</p></b>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Image;