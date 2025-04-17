import windowsIcon from "../styles/images/windows-icon.png";
import connectIcon from "../styles/images/conn-dialup-ok.png";
import speakerIcon from "../styles/images/loudspeaker-wave.png";

const Footer = () => {
	const time = new Date();
	const formattedTime = time.toLocaleString([], {
		hour: "numeric",
		minute: "2-digit",
	});

	return (
		<footer className='footer d-flex justify-content-between align-items-center'>
			<div className='d-flex'>
				<div>
					<button className='footer__start-button default'>
						<img
							src={windowsIcon}
							className='start__icon mr-2'
							alt='Windows Start icon'
						/>
						Start
					</button>
				</div>
				<span className='footer__active-program'>Slack</span>
			</div>

			<div className='status-bar-field flex-grow-0 text-uppercase footer__time-box d-flex justify-content-between'>
				<div className='d-flex'>
					<div className='footer__icon'>
						<img src={connectIcon} alt='Connection OK icon' />
					</div>
					<div className='footer__icon'>
						<img src={speakerIcon} alt='Speaker icon' />
					</div>
				</div>
				{formattedTime}
			</div>
		</footer>
	);
};

export default Footer;
