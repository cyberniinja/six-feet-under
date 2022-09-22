import './AttractionDetail.css';
import { useEffect, useState, useRef } from 'react';
const AttractionDetail = () => {
	const ref = useRef(null);
	const [map, setMap] = useState();
	const [service, setService] = useState();
	const [data, setData] = useState();

	// When the map variable is set add listeners for clicks etc.
	useEffect(() => {
		if (map) {
			['click', 'idle'].forEach((eventName) =>
				window.google.maps.event.clearListeners(map, eventName)
			);
			map.addListener('click', () => {});
			map.addListener('idle', () => (map) => {});
		}
	}, [map]);

	// set the api service and the map reference on first render
	useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}));
		}
		if (ref.current && map && !service) {
			setService(new window.google.maps.places.PlacesService(map));
		}
	}, [ref, map, service]);

	// once the service is instantiated fetch the information
	// when we have a list of attractions this will be done outside of the component
	useEffect(() => {
		if (service && !data) {
			const request = { placeId: 'ChIJB6CcRP5sVkYRenOflhTdY_Q' };
			service.getDetails(request, (result, status) => {
				setData(result);
				map.setCenter(result.geometry.location);
				map.setZoom(18);
				console.log(result);
			});
		}
	}, [data, service]);

	return (
		<div className="attraction-detail-container">
			{/* IMAGE VIEW */}
			<div className="attraction-detail-image-container">
				{/* iterate over all the photos in data and display them */}
				{data?.photos.map((x) => (
					<div className="attraction-detail-image">
						<a
							className="responsive"
							href={
								x.html_attributions[0].match(
									'(([\\w-]+:\\/\\/?|www[.])[^\\s()<>]+(?:\\([\\w\\d]+\\)|([^[:punct:]\\s]|\\/|\\d)))'
								)[0]
							}>
							<img src={x.getUrl()} alt="text" className="responsive" />
						</a>
					</div>
				))}
			</div>

			{/* HEADER */}
			<div className="attraction-detail-header">
				<div className="attraction-detail-title-container">
					<div className="attraction-detail-title">
						<div className="attraction-detail-name">{data?.name ?? ''}</div>
						<div className="attraction-detail-location">
							{data?.address_components[2].long_name},{' '}
							{data?.address_components[4].long_name}
						</div>
					</div>
					<div className="attraction-detail-type-container">
						{data?.types.map((x) => (
							<div className="attraction-detail-type">{x}</div>
						))}
					</div>
				</div>
				<div className="attraction-detail-header-divider"></div>
				<div className="attraction-detail-rating">{data?.rating} &#11088;</div>
			</div>

			{/* BODY */}
			<div className="attraction-detail-body">
				<div className="attraction-detail-map" ref={ref}></div>
				<div className="attraction-detail-info">
					<div className="attraction-detail-description">
						<b>Description: </b>
					</div>
					<div className="attraction-detail-address">
						<b>Address:</b> {data?.formatted_address ?? ''}
					</div>
				</div>

				<div className="attraction-detail-reviews"></div>
			</div>
		</div>
	);
};
export default AttractionDetail;