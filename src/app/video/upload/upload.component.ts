import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid'
import { switchMap } from 'rxjs/operators'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  isDragOver = false
  file : File | null = null
  isFileUploaded = false
  percentage = 0
  showPercentage = false
  user:firebase.User|null = null
  task: AngularFireUploadTask
  screenshots: string[] = []
  selectedScreenshot = ''
  screenshotTask : AngularFireUploadTask

  showAlert = false;
  alertMsg = 'Please wait the file is uploading...'
  alertColor ='blue'
  insubmission = false

  title = new FormControl('',[Validators.required,Validators.minLength(3)])

  uploadForm = new FormGroup(
    {
      title : this.title
    }
  )

  constructor(private storage: AngularFireStorage, 
    private auth : AngularFireAuth, 
    private clipsService:ClipService,
    private router:Router,
    public ffmpegService : FfmpegService) { 

    auth.user.subscribe(user => this.user = user)
    this.ffmpegService.init()
  }

  ngOnInit(): void {
  }

  ngOnDestroy():void
  {
    this.task?.cancel()
  }

  async storeFile($event:Event)
  {
    if(this.ffmpegService.isRunning)
    {
      return
    }

    this.isDragOver = false

    this.file = ($event as DragEvent).dataTransfer ?   //ternary
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files.item(0) ?? null
    
    // null collaescing if undefined received return null

    if(!this.file || this.file.type !== 'video/mp4')
    {
      return 
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(
        this.file.name.replace(/\.[^/.]+$/,'') //replace empty for file extension
    )
    this.isFileUploaded = true

    console.log(this.file)
  }

  async uploadFile() 
  {
    this.uploadForm.disable()  // to disable the form input change from user during upload
    this.showAlert = true;
    this.alertMsg = 'Please wait the file is uploading...'
    this.alertColor ='blue'
    this.insubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const screenshotblob = await this.ffmpegService.blobfromURL(
      this.selectedScreenshot 
    )

    const screenshotPath = `screenshots/${clipFileName}.png`

    this.task = this.storage.upload(clipPath,this.file)
    const clipRef = this.storage.ref(clipPath) // reference to clip

    this.screenshotTask = this.storage.upload(screenshotPath,screenshotblob)
    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([this.task.percentageChanges(), this.screenshotTask.percentageChanges()])
    .subscribe((progress) =>
      {

        const [clipProgress, screenshotProgress] = progress

        if(!clipProgress || !screenshotProgress)
        {
          return 
        }

        const total = clipProgress+ screenshotProgress;
        this.percentage = total as number / 2
      })

      forkJoin([this.task.snapshotChanges(),this.screenshotTask.snapshotChanges()]).
      pipe(
        switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
      ).subscribe(
      {
       next:async (urls)  => 
        {
          const [clipurl,screenshoturl] = urls;
          const clip = {
            uid: this.user?.uid,
            displayName : this.user?.displayName,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url : clipurl,
            screenshotFileName : `${clipFileName}.png`,
            screenshotURL : screenshoturl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }
          const ClipDocRef = await this.clipsService.createClip(clip)
          this.alertMsg = 'Your clip is uploaded'
          this.alertColor ='blue'
          this.showPercentage = false

          setTimeout(() =>
          {
            this.router.navigate(['clip',ClipDocRef.id])
          },1000)
        },

        error:(error) =>
        {
          this.uploadForm.enable()
          this.alertMsg = 'Upload failed try again'
          this.alertColor ='red'
          this.insubmission = true
          this.showPercentage = false
          console.log(error)
        }
      })
  }
}
 