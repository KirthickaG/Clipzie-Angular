import firebase from 'firebase/compat/app'

export default interface Iclip{
    uid: string;
    docID?:string, //optional
    displayName: string;
    title: string;
    fileName:string;
    url:string;
    screenshotFileName:string;
    screenshotURL : string;
    timestamp:firebase.firestore.FieldValue

}