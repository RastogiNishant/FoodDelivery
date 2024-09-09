"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

const ImagePicker = ({ label, name }) => {
	const [selectedImage, setSelectedImage] = useState(null);
	const imageInputRef = useRef();
	const handlePickClick = () => imageInputRef.current.click();

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (!file) {
			setSelectedImage(null);
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setSelectedImage(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	};
	return (
		<div className={classes.picker}>
			<label htmlFor={name}>{label}</label>
			<div className={classes.controls}>
				<div className={classes.preview}>
					{!selectedImage ? (
						<p>No Image Selected</p>
					) : (
						<Image
							fill
							src={selectedImage}
							alt='Selected Image by user'
						/>
					)}
				</div>
				<input
					required
					id={name}
					name={name}
					type='file'
					ref={imageInputRef}
					className={classes.input}
					onChange={handleImageChange}
					accept='image/png, image/jpeg'
				/>
				<button
					type='button'
					onClick={handlePickClick}
					className={classes.button}
				>
					Pick Image
				</button>
			</div>
		</div>
	);
};

export default ImagePicker;
