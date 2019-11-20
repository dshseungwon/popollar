import React from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import { withFirebase } from '../Firebase';

const baseStyle = {
  // width: 200,
  height: 200,
  borderWidth: 2,
  borderColor: '#666',
  borderStyle: 'dashed',
  borderRadius: 5,
  paddingLeft: 10
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee'
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#eee'
};

const INITIAL_STATE = {
  accepted: [],
  rejected: [],
  fileNameArray: [],
};

class UploadDropzone extends React.Component {

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    if(this.props.fileUrls !== undefined) {
      this.props.fileUrls.forEach((url) => {
        this.props.firebase.storage
          .refFromURL(url)
          .getMetadata().then((metadata) => {
            this.setState({
              fileNameArray: this.state.fileNameArray.concat(metadata.name)
            })
          }).catch(function(error) {
            console.log(error);
          });
      })
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {

    acceptedFiles.forEach((acceptedFile) => {

      let isExist = false;

      this.state.accepted.forEach((file) => {
        if(acceptedFile.name === file.name) {
          isExist = true;
        }
      })

      if(!isExist) {
        this.setState({
          accepted: this.state.accepted.concat(acceptedFile)
        }, () => {this.props.onNewFile(this.state.accepted)});
      }

    });
  }

  render() {
   return (
  
    <Dropzone onDrop={this.onDrop}>
      {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, acceptedFiles, rejectedFiles }) => {
        let styles = {...baseStyle}
        styles = isDragActive ? {...styles, ...activeStyle} : styles
        styles = isDragReject ? {...styles, ...rejectStyle} : styles
    
        return (
          <div
            {...getRootProps()}
            style={styles}
          >
            <input {...getInputProps()} />
            <p>
              {isDragAccept ? 'Drop' : 'Drag'} files here...
            </p>
            <div>
              {this.state.fileNameArray.map(name => <li key={name}>{name}</li>)}
            </div>
            <div>
              {this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}
            </div>
            {isDragReject && <div>Unsupported file type...</div>}
          </div>
        )
      }}
    </Dropzone>
   );
 }
}

export default withFirebase(UploadDropzone);