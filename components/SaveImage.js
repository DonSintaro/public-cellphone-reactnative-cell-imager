import firebase from 'firebase/app';
import 'firebase/storage';
import React, { useState } from "react";
import { db } from './db';


export default function SaveImage() {


    // Get a reference to the storage service, which is used to create references in your storage bucket

    const [selectedFile, setSelectedFile] = useState({});
    const [fileName, setFileName] = useState("Choose file");
    const [imagePrev, setImagePrev] = useState("");




    const fileSelectorHandler = event => {
        setSelectedFile(event.target.files[0])
        setFileName(event.target.files[0].name)
        // var reader = new FileReader();
        // reader.readAsDataURL(event.target.files[0]);
        // reader.onloadend = function(){
        // setImagePrev(reader.result);
        // }
    }

    const fileUploadHandle = () => {
        console.log(db);
        const firebase = db();
        const storage = firebase.storage();

        var file = selectedFile;
        var storageRef = storage.ref();

        var imagesRef = storageRef.child("Cells/Neutrophils/" + fileName);

        imagesRef.put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        }).catch(function (err) {
            console.log(err);
        });
        setFileName("Choose file");
        setImagePrev("");
    }
    return <div className="uploadAndPreview">

        <div >
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <button className="btn btn-outline-secondary" onClick={fileUploadHandle} type="button">Upload</button>
                </div>
                <div className="custom-file">
                    <input type="file" className="custom-file-input" id="inputGroupFile03" onChange={fileSelectorHandler} />
                    <label className="custom-file-label" htmlFor="inputGroupFile03">{fileName}</label>
                </div>
            </div>
        </div>
        <div className="previewImg">
        

            <img className="previewImg"  src={imagePrev}/>


        </div>

        <div>


        </div>


    </div>
}

SaveImage.getInitialProps = async function () {
    var firebase = db();
    var storage = firebase.storage();
    return {};
};