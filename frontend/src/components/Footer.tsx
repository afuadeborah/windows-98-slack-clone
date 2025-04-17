import windowsIcon from "../styles/images/windows-icon.png";

const Footer = () => {
	const time = new Date();
	const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

	return (
		<footer className='footer status-bar d-flex justify-content-between'>
			<p className='status-bar-field'>
				<button className='footer__start-button default'>
					<img src={windowsIcon} /> Start
				</button>
			</p>

			<p className='status-bar-field flex-grow-0 footer__time-box'>
				{formattedTime}
			</p>
		</footer>
	);
};

export default Footer;
