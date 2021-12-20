/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import Dropzone from "react-dropzone";
import { ErrorCodes } from "../localeTypes";
import GenericInput, { GenericInputProps } from "./GenericInput";

interface SignedRequest {
	signedRequest: string;
	url: string;
	key: string;
}

interface SingleFileUploaderProps extends GenericInputProps<string> {
	getSignedRequest: (file: File, extension: string) => Promise<SignedRequest | undefined | null>;
	required?: boolean;
	minSize?: number;
	maxSize?: number;
	allowedTypes?: DocumentTypes | DocumentTypes[];
	fileIcon?: React.ReactChild;
	uploadIcon?: React.ReactChild;
	deleteIcon?: React.ReactChild;
}

export interface FileState {
	file: File;
	isUploading: boolean;
	progress: number;
	signedRequest?: any;
	url?: any;
	key?: any;
	isImage?: boolean;
}
type DocumentTypes =
	| ".pdf"
	| "xslx"
	| "xls"
	| ".png"
	| ".jpg"
	| ".jpeg"
	| ".gif"
	| ".tiff"
	| ".bmp"
	| ".svg"
	| ".doc"
	| ".txt"
	| "audio/*"
	| "video/*"
	| "image/*";

export default class SingleFileUploader extends GenericInput<string, SingleFileUploaderProps> {
	state = {
		value: this.props.value,
		valid: true,
		focus: false,
		errorMessage: undefined,
		droppedFile: undefined as undefined | FileState
	};

	protected _validate = () => {
		let valid = true;
		let errorCode: ErrorCodes = ErrorCodes.Default;
		if (this.props.required && !this.state.value) {
			valid = false;
			errorCode = ErrorCodes.ImageRequired;
		}
		return { valid, errorCode };
	};

	constructor(props: SingleFileUploaderProps) {
		super(props);
		this.reference = React.createRef<any>();
	}

	componentDidMount() {
		this.loadDefaultValue();
	}

	public loadDefaultValue = () => {
		this.setState({ value: this.props.defaultValue ?? this.props.value });
	};

	componentDidUpdate(lastProps: SingleFileUploaderProps) {
		const value = this.props.value ? this.props.value : null;
		if (this.props.value !== lastProps.value) {
			this.setState({ value });
		}
	}

	public reset = () => {
		return new Promise<void>((resolve) => {
			this.resetted = false;
			if (this.props.onChange && this.props.changeTriggerReset) this.props.onChange(undefined);
			if (this.props._change) this.props._change({ name: this.props.name, value: undefined });
			this.setState(
				{
					value: null,
					errorMessage: undefined,
					valid: true
				},
				resolve
			);
		});
	};

	private onChange = (value?: string) => {
		this.resetted = false;
		this.setState(
			{
				droppedFile: undefined,
				value,
				errorMessage: undefined
			},
			() => {
				this.onBlur();

				if (this.props.onChange) this.props.onChange(value);
				if (this.props._change) this.props._change({ name: this.props.name, value });
			}
		);
	};

	private onDrop = async (files: File[]) => {
		const extension = files[0]?.name?.split(".").pop()?.toLowerCase();
		if (!extension) return;
		const isImage = !!extension?.match(/(jpg|jpeg|gif|png|tiff|bmp)/);

		const droppedFile: FileState = { file: files[0], isUploading: false, progress: 0, isImage };
		this.setState({ droppedFile, errorMessage: undefined });
		this.props
			.getSignedRequest(droppedFile.file, extension)
			.then((res) => {
				if (!res) return;
				const { key, signedRequest, url } = res;
				droppedFile.signedRequest = signedRequest;
				droppedFile.url = url;
				droppedFile.key = key;
				droppedFile.isUploading = true;

				const xhr = new XMLHttpRequest();
				xhr.open("PUT", signedRequest);
				xhr.upload.addEventListener("progress", (d) => {
					droppedFile.progress = (d.loaded / d.total) * 100;
					this.setState({ droppedFile, errorMessage: undefined });
				});
				xhr.onloadend = () => {
					droppedFile.progress = 100;
					droppedFile.isUploading = false;
					droppedFile.url = url;
					this.setState({ droppedFile });
					this.onChange(url);
				};
				xhr.send(droppedFile.file);
			})
			.catch((err: any) => {
				if (typeof err === "string") {
					this.setState({ errorMessage: err });
				} else if (err.message) {
					this.setState({ errorMessage: err.message });
				} else {
					// eslint-disable-next-line no-console
					console.error("Error cannot be displayed", err);
				}
			});
	};

	private getClassName = (accept: boolean, reject: boolean) => {
		let className = "dropzone";
		if (accept) className += " accept";
		if (reject) className += " reject";
		if (this.state.errorMessage) className += " error";
		return className;
	};

	private onDeleteFile = () => {
		this.onChange();
	};

	private isValidImageURL = (str: string) => {
		if (typeof str !== "string") return false;
		return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
	};

	render() {
		const { value, droppedFile, errorMessage } = this.state;
		const { minSize, maxSize } = this.props;
		return (
			<div style={this.props.style} className={this.buildClassList("onedash-single-file-uploader")}>
				{this.props.label && (
					<label className="onedash-label" htmlFor={this.id}>
						{this.props.label}
					</label>
				)}

				{!value && (
					<>
						{droppedFile === undefined || droppedFile === null ? (
							<Dropzone
								accept={this.props.allowedTypes}
								minSize={minSize}
								maxSize={maxSize}
								disabled={this.props.disabled}
								maxFiles={1}
								onDrop={this.onDrop}>
								{({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
									<div className="image-upload-area container">
										<div
											{...getRootProps({
												className: this.getClassName(isDragAccept, isDragReject)
											})}>
											<input {...getInputProps()} />
											<div className="upload-icon">
												{this.props.uploadIcon ?? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														viewBox="0 0 24 24">
														<path d="M10 9h-6l8-9 8 9h-6v11h-4v-11zm11 11v2h-18v-2h-2v4h22v-4h-2z" />
													</svg>
												)}
											</div>
											{this.props.placeholder && (
												<div className="content-placeholder">{this.props.placeholder}</div>
											)}
											{errorMessage && <div className="error-message">{errorMessage}</div>}
										</div>
									</div>
								)}
							</Dropzone>
						) : (
							<div className={droppedFile.isImage ? "image" : "file"}>
								<button className="delete-btn" onClick={this.onDeleteFile}>
									{this.props.deleteIcon ?? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24">
											<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
										</svg>
									)}
								</button>
								{droppedFile.isImage ? (
									<img alt="Vorschaubild" src={URL.createObjectURL(droppedFile.file)} />
								) : (
									<>
										{this.props.fileIcon ?? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24">
												<path d="M14.568.075c2.202 1.174 5.938 4.883 7.432 6.881-1.286-.9-4.044-1.657-6.091-1.179.222-1.468-.185-4.534-1.341-5.702zm-.824 7.925s1.522-8-3.335-8h-8.409v24h20v-13c0-3.419-5.247-3.745-8.256-3z" />
											</svg>
										)}
									</>
								)}
								<div className="progress-bar">
									<span style={{ width: `${droppedFile.progress}%` }} />
								</div>
							</div>
						)}
					</>
				)}

				{value && (
					<>
						{this.isValidImageURL(value) ? (
							<div className="image">
								<button className="delete-btn" onClick={this.onDeleteFile}>
									{this.props.deleteIcon ?? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24">
											<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
										</svg>
									)}
								</button>
								<img alt="Vorschaubild" src={value} />
							</div>
						) : (
							<div className="file">
								<button className="delete-btn" onClick={this.onDeleteFile}>
									{this.props.deleteIcon ?? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24">
											<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z" />
										</svg>
									)}
								</button>
								{this.props.fileIcon ?? (
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M14.568.075c2.202 1.174 5.938 4.883 7.432 6.881-1.286-.9-4.044-1.657-6.091-1.179.222-1.468-.185-4.534-1.341-5.702zm-.824 7.925s1.522-8-3.335-8h-8.409v24h20v-13c0-3.419-5.247-3.745-8.256-3z" />
									</svg>
								)}
							</div>
						)}
					</>
				)}
			</div>
		);
	}
}
