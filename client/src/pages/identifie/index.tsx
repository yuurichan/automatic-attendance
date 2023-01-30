import React, { useRef, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js';
import "./index.scss"
import { ALERT } from '../../store/types/alertTypes'
import { useDispatch, useSelector } from 'react-redux'
import { postAPI } from '../../utils/fetchApi'
import { RootStore } from '../../utils/interface'
import * as XLSX from 'xlsx'
import { Course, Student } from '../../utils/interface'

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AttendanceDetailRow from '../../components/roll-call-session/AttendanceDetailRow'
import { makeStyles } from '@mui/styles';
import PrimaryTooltip from '../../components/globals/tool-tip/Tooltip'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';

const Identifie = () => {

  const dispatch = useDispatch()

  const [openControlIden, setOpenControlIden] = useState<boolean>(true);
  const [handmade, setHandmade] = useState<number>(0)
  const { auth } = useSelector((state: RootStore) => state)
  const [tracks, setTracks] = useState<any>()
  const [playing, setPlaying] = useState<boolean>(false)
  const [loadingModel, setLoadingModel] = useState<boolean>(false)
  const [timers, setTimers] = useState<any>()
  const [studentCode, setStudentCode] = useState<string>("")
  const [isDetecttion, setIsDetection] = useState<boolean>(false)
  const [isRecognition, setIsRecognition] = useState<boolean>(false)
  //
  const [userData, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const [isFile, setIsFile] = useState<boolean>(false)
  const [file, setFile] = useState<File>();
  const refInput = useRef() as React.MutableRefObject<HTMLInputElement>;

  // Dùng để chỉ đúng element (querySelector) giống js thuần nhưng vì node không có document
  // nên ta dùng cái này 
  const refCamera = useRef<any>(null);
  const refCanvas = useRef<any>(null);

  // Tai cac mo hinh nhan dien khuon mat da duoc train san
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URI = process.env.PUBLIC_URL + '/models'

      Promise.all(
        [
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URI), // Pre-trained model dùng để phát hiện gương mặt.
          // faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI), // FaceLandmark68Net Model: Pre-trained model dùng để xác định được các điểm xung quanh mặt.
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI) // Pre-trained model dùng để nhận dạng gương mặt.
        ]
      )

      // Tai cac model nhan dien khuon mat thanh cong
      setLoadingModel(true);
      dispatch({ type: ALERT, payload: { success: "Tải các Pre-trained model thành công" } })
    }
    loadModels()
  }, [])

  useEffect(() => {
    return () => {
      if (playing === true && timers && tracks) {
        console.log(playing, tracks, timers, '+++ UseEff is triggered')
        setPlaying(false)
        setTracks(null)
        setTimers(0)
        tracks && tracks.forEach((track: any) => { track.stop(); })
        refCamera.current?.srcObject?.getTracks()[0].stop();
        clearInterval(timers)
        console.log('Camera closed since there is a change in either playing/tracks/timers')
        //console.log(playing, tracks, timers)
      }
    }
  }, [playing, timers, tracks]) // useEff dc goi khi mot trong cac gtri thay doi

  const handleCloseDialogControlIden = (isClose: boolean) => {
    if (isClose) setHandmade(2)
    setOpenControlIden(false)
  }

  // Open camera
  const handleOpenCamera = () => {
    if (navigator.mediaDevices && loadingModel) {
      setPlaying(true)
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        let video = refCamera.current
        if (video) {
          video.srcObject = stream
          const track = stream.getTracks()
          setTracks(track)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  // Close camera
  const hanldeCloseCamera = () => {
    if (tracks) {
      setPlaying(false)
      tracks && tracks.forEach((track: any) => { track.stop(); })
      refCamera.current?.srcObject?.getTracks()[0].stop();
      clearInterval(timers)
      console.log('Camera Close Handler: ', playing, tracks, timers)
    }
  }

  // Phat hien khuon mat
  const hanldeCameraPlay = () => {
    setIsDetection(true)
    console.log('Camera has just been opened: ', isDetecttion);
    if (loadingModel && studentCode) {
      const descriptors: any[] = [];
      let flag = false;
      const timer = setInterval(async () => {
        // Tao canvas de ve 
        if (descriptors.length <= 6 && flag === false) {
          refCanvas.current.innerHTML = faceapi.createCanvasFromMedia(refCamera.current)
          const displaySize = {
            width: 640, height: 480
          }

          faceapi.matchDimensions(refCanvas.current, displaySize)

          // Computing Face Descriptors
          // Tính toán các gốc cạnh trên khuôn mặt
          const detection = await faceapi.detectSingleFace(refCamera.current, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor()
          //console.log('Detection desc value: ', detection)

          if (detection) {
            const fullFaceDescriptions = faceapi.resizeResults(detection, displaySize)
            //console.log('Resized Result: ', fullFaceDescriptions)

            setIsDetection(false)
            setIsRecognition(true)
            console.log('Detection finished: ', isDetecttion);
            console.log('Recognition: ', isRecognition);

            // // Xoa cac canvas truoc
            if (refCanvas.current) {
              refCanvas.current.getContext('2d').clearRect(0, 0, 640, 480)
            }


            // Lấy các điểm trong khuôn mặt, sau đó vẽ lên canvas
            const box = fullFaceDescriptions?.detection?.box
            const drawBox = new faceapi.draw.DrawBox(box as any, {
              label: "Đang nhận diện..."
            })
            drawBox.draw(refCanvas.current)
            faceapi.draw.drawFaceLandmarks(refCanvas.current, fullFaceDescriptions)   // test

            // /* -------------- Huan luyen mo hinh --------------*/

            // Computing Face Descriptors
            const fullFaceDescription = await faceapi.detectSingleFace(refCamera.current)
              .withFaceLandmarks().withFaceDescriptor()
              //console.log('Fullface Descriptors: ', fullFaceDescription)

            if (!fullFaceDescription) {
              throw new Error(`no faces detected for ${studentCode}`)
            }

            // Luu 12 descriptors lai
            descriptors.push(fullFaceDescription.descriptor)
            descriptors.forEach(desc => {
              console.log('Current Descriptors: ', desc)
            })

            // Tai xong 12 descriptors 
            if (flag === false && (descriptors.length === 4 || descriptors.length === 3 || descriptors.length === 2)) {
              //console.log(descriptors)
              // Gan nhan
              const labedlFaceDescriptors = new faceapi.LabeledFaceDescriptors(studentCode, descriptors);
              console.log({ labedlFaceDescriptors }, labedlFaceDescriptors.descriptors.length)
              saveFile(labedlFaceDescriptors)

              flag = true
              setStudentCode("")
              hanldeCloseCamera()
              setIsRecognition(false)
              console.log('Recognition finished: ', isRecognition);
              dispatch({ type: ALERT, payload: { success: `Nhận diện ${studentCode} thành công` } })

              // Xoa canvas cuoi cung
              if (refCanvas.current) {
                refCanvas.current.getContext('2d').clearRect(0, 0, 640, 480)
              }
            }
          }

        }
        //console.log('Descs length: ', descriptors.length)
        //console.log('Descs: ', descriptors)   // vi viec lay cac descriptors la async nen cai nay se in ra tat
        // ca cac descriptors trong mang cac descriptors (array of (array of 128 vals))
        console.log('State of detect: ', isDetecttion);
        console.log('State of recog: ', isRecognition);
      }, 200)
      setTimers(timer)
    }
  }

  const saveFile = async (labedlFaceDescriptors: any) => {
    const labedlFaceDescriptorsJson = faceapi.LabeledFaceDescriptors.fromJSON(labedlFaceDescriptors).toJSON()
    try {
      const res = await postAPI('face_api', labedlFaceDescriptorsJson, auth.access_token)
      console.log(res)
    } catch (error: any) {
      console.log(error.response)
    }

  }

  // Xu ly file excel
  const handleClose = () => {
    setOpen(false)
    if (refInput.current) {
        refInput.current.value = "";
    }
  }

  const handleChangeFile = (e: any) => {
    try {
      const file = e.target.files[0]
      setFile(file)
      // Bắt đầu đọc nội dung của blobOrFile, một khi hoàn thành,
      // fileReader.result sẽ là một đối tượng ArrayBuffer.
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = async (e) => {

          if (e.target) {
              const bufferArray = e.target.result;

              const wb = XLSX.read(bufferArray, { type: 'buffer' })

              // console.log(wb)

              // Lấy SheetNames đầu tiên
              const wsname = wb.SheetNames[0]

              const ws = wb.Sheets[wsname]

              // Chuyển thành array để xử lý
              const data = XLSX.utils.sheet_to_json(ws, { header: 1 })

              // Tim STT
              let stt_top = 0;
              let index_user_id = -1;
              let index_image_link = -1;

              // column order
              // no. : 0 - timestamp: 1 - user id: 2

              data.forEach((item: any, i) => {
                  let index_stt = -1;
                  //console.log('Item length: ', item.length);

                  if (item.length !== 0) {
                      index_stt = item.findIndex((_item: any) => {
                          if (typeof _item === 'string')
                              return _item.toLowerCase() === "no." || _item.toLowerCase() === "number"
                      })
                      console.log('Index STT: ', index_stt);

                      if (index_stt !== -1) {
                          if (index_user_id === -1) {
                              index_user_id = item.findIndex((_item: any) => {
                                  if (typeof _item === 'string') {
                                      return _item.toLowerCase() === "user id"
                                          || _item.toLowerCase() === "uid"
                                  }
                              })
                          }
                          console.log('Index MSSV: ', index_user_id);

                          if (index_image_link === -1) {
                              index_image_link = item.findIndex((_item: any) => {
                                  if (typeof _item === 'string') {
                                      return _item.toLowerCase() === "portrait image"
                                  }
                              })
                          }
                          console.log('Index MSSV: ', index_image_link);
                      }
                  }

                  // Only case where this is triggered is with i = 0
                  if (index_stt !== -1) {
                      stt_top = i;
                      console.log("STT_TOP: ", stt_top);
                  }
              })

              if (data) {
                  if (index_user_id !== -1 && index_image_link !== -1) {
                      const newData: any[] = [];
                      data.slice(stt_top + 1,).forEach((item: any) => {
                          if (item.length !== 0) {
                              const student = {
                                  label: item[index_user_id] ? item[index_user_id].trim() : "",
                                  link_id: item[index_image_link] ? item[index_image_link].trim().substring(item[index_image_link].indexOf('?id=')) : '',
                              }
                              newData.push(student)
                          }
                      })
                      setData(newData)
                  }
              }
          }
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const handleImageTraining = () => {
    if (loadingModel && userData) { 
      userData.forEach(async (_data: any) => {
        const descriptors: any[] = [];
        let flag = false;
        const user = _data.label ? _data.label : "N/A"
        const img = await faceapi.fetchImage(`https://drive.google.com/uc${_data.link_id}`);

        const detection = await faceapi.detectSingleFace(img, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
          const fullFaceDescriptors = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          console.log('Fullface Descriptors: ', fullFaceDescriptors)
          
          if (!fullFaceDescriptors) {
              throw new Error(`No faces detected for ${user}`)
          }
          
          // Saving 128 descs
          descriptors.push(fullFaceDescriptors.descriptor)
          descriptors.forEach(desc => {
              console.log('Current Descriptors: ', desc)
          })
          console.log('Descs length: ', descriptors.length)

          const labeldFaceDescriptors = new faceapi.LabeledFaceDescriptors(user, descriptors);
          console.log({ labeldFaceDescriptors }, labeldFaceDescriptors.descriptors.length)

          console.log('Descriptors: ', labeldFaceDescriptors);
          if (labeldFaceDescriptors) saveFile(labeldFaceDescriptors);
          dispatch({ type: ALERT, payload: { success: `Nhận diện ${user} thành công` } })
        }
      });
    }
  }


  return (
    <div className="identifie">
      <div className="identifie__body">

        {handmade === 1 ? <div className="identifie__body-form">
          <label htmlFor="studentCode">Mã số sinh viên *</label>
          <input id="studentCode"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            type="text" placeholder='Vui lòng nhập MSSV...' name='studentCode' />
          {
            playing ?
              <>
                {
                  isDetecttion ? <p style={{ marginTop: "20px", fontSize: "1.4rem", fontWeight: "500" }}>
                    Đang <span style={{ color: 'crimson', textTransform: "uppercase" }}>phát hiện</span>  khuôn mặt, xin vui lòng chờ...
                  </p> : isRecognition && <p style={{ marginTop: "20px", fontSize: "1.4rem", fontWeight: "500" }}>
                    Đang <span style={{ color: '#473fce', textTransform: "uppercase" }}>nhận hiện</span> khuôn mặt, xin vui lòng chờ...
                  </p>
                }
              </>
              : <Button disabled={studentCode ? false : true} variant='contained' className="identifie__btn-open" onClick={handleOpenCamera}>
                <p className='button-text'>Bắt đầu nhận diện</p>
              </Button>
          }
        </div> : <div className="identifie__body-form">
          <label htmlFor="fileInput">Google Form Response File *</label>
          <div className="identifie__file">
            <input name="fileInput" 
              ref={refInput} 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              placeholder='Thêm file...'
              onChange={handleChangeFile} />
          </div>
          <Button disabled={isFile ? false : true} variant='contained' className="identifie__btn-open" onClick={handleImageTraining}>
                <p className='button-text'>Thêm file</p>
          </Button>
          
        </div>}


        {handmade === 1 ? <div className="identifie__camera">
          {
            playing && <>
              <video onPlay={hanldeCameraPlay} ref={refCamera} autoPlay muted></video>
              <canvas ref={refCanvas}></canvas>
            </>
          }
        </div> : <></>}


        {/* Dialog Controll Attendance */}
        {
          <Dialog
              open={openControlIden}
              onClose={handleCloseDialogControlIden}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
            <Box padding={2}>
                <Box display='flex' justifyContent="space-between" alignItems='center' mb={2}>
                    <h2 className="modal__heading">Chọn cách thức điêm danh</h2>
                </Box>
                <DialogActions>
                    <PrimaryTooltip title="Điểm danh thủ công bằng tay">
                        <Button color="success" variant='contained' onClick={() => { setHandmade(1); handleCloseDialogControlIden(false) }}>
                            <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-table'></i>  <p className="button-text">Nhận dạng tự động</p>
                        </Button>
                    </PrimaryTooltip>
                    <PrimaryTooltip title="Điểm danh tự động bằng khuôn mặt" >
                        <Button color="info" variant='contained' onClick={() => { setHandmade(2); handleCloseDialogControlIden(false);}}>
                            <i style={{ fontSize: '2.4rem', marginRight: "5px" }} className='bx bx-user-circle'></i>  <p className="button-text">Nhận dạng thủ công</p>
                        </Button>
                    </PrimaryTooltip>
                </DialogActions>
            </Box>
          </Dialog>
        }
      </div>
    </div >
  )
}

export default Identifie