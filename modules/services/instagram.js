import dispatch from "../dispatch";
import uploadFile from "../upload";

export default scope => {
	const safeUploadFile = () => {
		uploadFile(null, scope).catch(() => {});
	};
	const err = () => {
		scope.changePage("instagram");
		const error = scope.i18n.errors.instagram_no_fetch;
		scope.showError(error);
		dispatch("uploadError", error);
		scope.isUploading = false;
	};
	const buttonElt = document.querySelector(`#uppload_${scope.meta.uniqueId} #instagramButton`);
	const inputElt = document.querySelector(`#uppload_${scope.meta.uniqueId} #instagramInput`);
	buttonElt.addEventListener("click", event => {
		scope.changePage("uploading");
		scope.isUploading = true;
		dispatch("uploadStarted");
		setTimeout(() => {
			fetch(`https://api.microlink.io/?url=${inputElt.value}`)
				.then(response => response.json())
				.then(json => {
					if (json.status === "success") {
						if (json.data && json.data.image && json.data.image.url) {
							dispatch("fileUploaded", json.data.image.url);
							scope.changePage("uploaded");
							scope.isUploading = false;
							scope.updateValue(json.data.image.url);
						} else {
							err();
						}
					} else {
						err();
					}
				})
				.catch(error => {
					err();
				});
		}, scope.settings.minimumDelay || 0);
	});
	inputElt.addEventListener("keyup", event => {
		event.preventDefault();
		if (event.keyCode === 13) {
			buttonElt.click();
		}
	});
};
