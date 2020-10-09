import React from "react";

const ErrorIcon = ({ active }: { active?: boolean }) => (
	<div className={active ? "active error-icon" : "error-icon"}>
		<div className="icon">
			<svg className="circular stroke">
				<circle className="path" cx="75" cy="75" r="50" fill="none" strokeWidth="5" strokeMiterlimit="10" />
			</svg>
			<svg className="cross stroke">
				<g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)">
					<path className="first-line" d="M634.087,300.805L673.361,261.53" fill="none" />
				</g>
				<g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)">
					<path className="second-line" d="M634.087,300.805L673.361,261.53" />
				</g>
			</svg>
		</div>
	</div>
);

export default ErrorIcon;
