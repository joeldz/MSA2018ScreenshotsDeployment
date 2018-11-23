import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import ScreenshotDetail from './components/ScreenshotDetail';
import ScreenshotList from './components/ScreenshotList';
// import PatrickLogo from './patrick-logo.png';


interface IState {
	currentScreenshot: any,
	screenshots: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentScreenshot: {"id":0, "series":"Loading ", "episode":"0", "subtitle":"uwu", "timestamp":"00:00:00", "url":"","uploaded":"","width":"0","height":"0"},
			screenshots: [],
			open: false,
			uploadFileList: null
		}     	
		this.selectNewScreenshot = this.selectNewScreenshot.bind(this)
		this.fetchScreenshots = this.fetchScreenshots.bind(this)
		this.fetchScreenshots("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadScreenshot = this.uploadScreenshot.bind(this)
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
					{/* <img src={PatrickLogo} height='40'/>&nbsp;  */}
          			My Screenshot Bank - MSA 2018 &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Screenshot</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<ScreenshotList screenshots={this.state.screenshots} selectNewScreenshot={this.selectNewScreenshot} searchBySubtitle={this.fetchScreenshots}/>
					</div>
					<div className="col-5">
						<ScreenshotDetail currentScreenshot={this.state.currentScreenshot} />
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="screenshot-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadScreenshot}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected screenshot
	private selectNewScreenshot(newScreenshot: any) {
		this.setState({
			currentScreenshot: newScreenshot
		})
	}

	private fetchScreenshots(tag: any) {
		let url = "http://jdez501screenshotapi.azurewebsites.net/api/Screenshot"
		if (tag !== "") {
			url += "/tag?tags=" + tag
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentScreenshot = json[0]
			if (currentScreenshot === undefined) {
				currentScreenshot = {"id":0, "series":"No screenshots (╯°□°）╯︵ ┻━┻","episode":"0","timestamp":"00:00:00","url":"","subtitle":"try a different search term","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentScreenshot,
				screenshots: json
			})
		});
	}

	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	private uploadScreenshot() {
		const imageFile = this.state.uploadFileList[0]
	
		if (imageFile === null) {
			return;
		}
		const url = "http://jdez501screenshotapi.azurewebsites.net/api/Screenshot/upload"
	
		const formData = new FormData()
		formData.append("image", imageFile)
	
		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
		.then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})
	}

}

export default App;