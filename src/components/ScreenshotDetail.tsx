import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentScreenshot: any
}

interface IState {
    open: boolean
}

export default class ScreenshotDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }
        this.updateScreenshot = this.updateScreenshot.bind(this)
        this.deleteScreenshot = this.deleteScreenshot.bind(this)
    }

	public render() {
        const currentScreenshot = this.props.currentScreenshot
        const { open } = this.state;
		return (
			<div className="container screenshot-wrapper">
                <div className="row screenshot-heading">
                    <b>Series:&nbsp; {currentScreenshot.series}</b>
                </div>
                <div className="row screenshot-date">
                    <b>Episode:&nbsp; </b>{currentScreenshot.episode}
                </div>
                <div className="row screenshot-date">
                    <b>Timestamp:&nbsp; </b>{currentScreenshot.timestamp}
                </div>
                <div className="row screenshot-date">
                    <b>Subtitle:&nbsp; </b>{currentScreenshot.subtitle}
                </div>
                <div className="row screenshot-img">
                    <img src={currentScreenshot.url}/>
                </div>
                
                <div className="row screenshot-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadScreenshot.bind(this, currentScreenshot.url)}>Download </div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteScreenshot.bind(this, currentScreenshot.id)}>Delete </div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Series</label>
                            <input type="text" className="form-control" id="screenshot-edit-series-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">You can edit any screenshot later</small>
                        </div>
                        <div className="form-group">
                            <label>Episode</label>
                            <input type="text" className="form-control" id="screenshot-edit-episode-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Any # from 1 to last episode</small>
                        </div>
                        <div className="form-group">
                            <label>Timestamp</label>
                            <input type="text" className="form-control" id="screenshot-edit-timestamp-input" placeholder="Enter Title"/>
                            <small className="form-text text-muted">HH:MM:SS</small>
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input type="text" className="form-control" id="screenshot-edit-subtitle-input" placeholder="Enter Tag"/>
                            <small className="form-text text-muted">Subtitle is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateScreenshot}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };

    // Open screenshot image in new tab
    private downloadScreenshot(url: any) {
        window.open(url);
    }

    private updateScreenshot(){
        const seriesInput = document.getElementById("screenshot-edit-series-input") as HTMLInputElement
        const episodeInput = document.getElementById("screenshot-edit-episode-input") as HTMLInputElement
        const timestampInput = document.getElementById("screenshot-edit-timestamp-input") as HTMLInputElement
        const subtitleInput = document.getElementById("screenshot-edit-subtitle-input") as HTMLInputElement
    
        
        if (seriesInput === null || episodeInput === null || timestampInput === null || subtitleInput === null) {
            return;
        }
    
        const currentScreenshot = this.props.currentScreenshot
        const url = "https://jdez501screenshotapi.azurewebsites.net/api/screenshot/" + currentScreenshot.id
        const updatedSeries = seriesInput.value
        const updatedEpisode = episodeInput.value
        const updatedTimestamp = timestampInput.value
        const updatedSubtitle = subtitleInput.value
        fetch(url, {
            body: JSON.stringify({
                "id": currentScreenshot.id,
                "series": updatedSeries,
                "episode": updatedEpisode,
                "timestamp": updatedTimestamp,
                "subtitle": updatedSubtitle,
                "uploaded": currentScreenshot.uploaded,
                "url": currentScreenshot.url,
                "width": currentScreenshot.width,
                "height": currentScreenshot.height
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }

    private deleteScreenshot(id: any) {
        const url = "http://jdez501screenshotapi.azurewebsites.net/api/screenshot/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
}