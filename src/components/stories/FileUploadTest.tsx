/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import SingleFileUploader from "../SingleFileUploader";

const FileUploadTest = (props: any) => {
	return (
		<div>
			<SingleFileUploader required {...props} />
		</div>
	);
};

export default FileUploadTest;
