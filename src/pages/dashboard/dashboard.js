/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/css/jsvectormap.min.css';
import { Card, CardBody, CardExpandToggler } from './../../components/card/card.jsx';
import Chart from 'react-apexcharts';
import { useRequest } from "../../service/index.js"

const MARKURL = 'https://starlinkbot.s3.ap-southeast-1.amazonaws.com/assets/mark.gif'

function Dashboard() {
	const { request } = useRequest() 
	const [networkUsage, setNetworkUsage] = useState(null)
	const [diskUsage, setDiskUsage] = useState(0)
	const [countryBots, setCountryBots] = useState([])

	useEffect(() => {
		async function getNetworkUsage() {
			const resp = await request("app/dashboard/network_usage")
			const _datas = resp.map(item => Number(item.data || "0"))
			const _max = Math.max(..._datas)
			const _min = Math.min(..._datas)
			const _chg = ((_datas[_datas.length - 1] - _datas[0]) / _datas[0]).toFixed(2) * 100
			setNetworkUsage({...networkUsage, datas: _datas, max: _max, min: _min, chg: _chg})
		}
		getNetworkUsage()
	}, [])

	useEffect(() => {
		async function getDiskUsage() {
			const resp = await request("app/dashboard/disk_usage")
			setDiskUsage(resp)
		}
		getDiskUsage()
	}, [])

	useEffect(() => {
		async function getCountryBots() {
			const resp = await request("app/dashboard/country_bots")
			const total = resp.reduce((sum, item) => sum + item.second, 0)
			const sortedResp = resp.sort((a, b) => b.second - a.second)
			const topFiveResp = sortedResp.slice(0, 5)
			const _countryBots = []
			topFiveResp.forEach((_resp) => {
				const __resp = {
					name: _resp.first,
					visits: _resp.second,
					pct: ((_resp.second / total) * 100).toFixed(2),
					class: ""
				}
				_countryBots.push(__resp)
			})
			setCountryBots(_countryBots)
		}
		getCountryBots()
	}, [])

	// useEffect(() => {
	// 	async function getDataCenter() {
	// 		const resp = await request("app/dashboard/data_centers")
	// 		console.log("data_centers======>", resp)
	// 	}
	// 	getDataCenter()
	// }, [])
	
	function randomNo() {
		return Math.floor(Math.random() * 46) + 40
	};
	
	// server chart
	var serverChartData = [
		{ name: 'MEMORY USAGE', data: [randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo()]},
		{ name: 'CPU USAGE', data: [randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo(), randomNo()]}
	];
	
	const [statsData, setStatsData] = useState();
	const [serverData, setServerData] = useState();
	const [countryData, setCountryData] = useState();
	const [sourceData, setSourceData] = useState();
	const [sourceChartData, setSourceChartData] = useState();
	const [productData, setProductData] = useState();
	const [activityLogData, setActivityLogData] = useState();
	const [chartOptions, setChartOptions] = useState(getChartOptions());
	const [serverChartOptions, setServerChartOptions] = useState(getServerChartOptions());
  
  function getChartOptions() {
		var themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-theme')).trim();
		var themeColorRgb = (getComputedStyle(document.body).getPropertyValue('--bs-theme-rgb')).trim();
		
		return {
			bar: {
				colors: [themeColor],
				chart: { sparkline: { enabled: true } },
				tooltip: { x: { show: false }, y: { title: { formatter: function (seriesName) { return '' } } } }
			},
			line: {
				colors: [themeColor],
				chart: { sparkline: { enabled: true } },
				stroke: { curve: 'straight', width: 2 },
				tooltip: { x: { show: false }, y: { title: { formatter: function (seriesName) { return '' } } } }
			},
			pie: {
				colors: ['rgba('+ themeColorRgb + ', 1)', 'rgba('+ themeColorRgb + ', .75)', 'rgba('+ themeColorRgb + ', .5)'],
				chart: { sparkline: { enabled: true } },
				stroke: { show: false },
				tooltip: { x: { show: false }, y: { title: { formatter: function (seriesName) { return '' } } } }
			},
			donut: {
				colors: ['rgba('+ themeColorRgb + ', .15)', 'rgba('+ themeColorRgb + ', .35)', 'rgba('+ themeColorRgb + ', .55)', 'rgba('+ themeColorRgb + ', .75)', 'rgba('+ themeColorRgb + ', .95)'],
				chart: { sparkline: { enabled: true } },
				stroke: { show: false },
				tooltip: { x: { show: false }, y: { title: { formatter: function (seriesName) { return '' } } } },
			}
		};
  }
  
  function getServerChartOptions() {
  	var borderColor = (getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
  	var bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
  	var inverseRgb = (getComputedStyle(document.body).getPropertyValue('--bs-inverse-rgb')).trim();
  	var themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-theme')).trim();
		var themeFont = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		
  	return {
    	chart: { toolbar: { show: false } },
   		plotOptions: { bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' } },
    	dataLabels: { enabled: false },
			grid: { show: true, borderColor: borderColor },
			stroke: { show: false },
    	colors: ['rgba('+ inverseRgb +', .15)', themeColor],
			legend: { fontFamily: themeFont, labels: { colors: bodyColor } },
			xaxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				labels: { show: false },
				axisBorder: { show: true, color: borderColor, height: 1, width: '100%', 	offsetX: 0, offsetY: -1 },
				axisTicks: { show: true, borderType: 'solid', color: borderColor, height: 6, offsetX: 0, offsetY: 0 },
			},
			yaxis: { 
				labels: { style: { colors: bodyColor, fontSize: '12px', fontFamily: themeFont, fontWeight: 400, cssClass: 'apexcharts-xaxis-label' } }
			},
			fill: { opacity: .65 },
			tooltip: { y: { formatter: function (val) { return "$ " + val + " thousands" } } }
  	};
  }
  
  function renderMap() {
		var inverse = (getComputedStyle(document.body).getPropertyValue('--bs-inverse')).trim();
		var themeColor = (getComputedStyle(document.body).getPropertyValue('--bs-theme')).trim();
		const map = document.getElementById('world-map');
		const mapElm = document.querySelectorAll('.jvm-tooltip');
		
		if (map) {
			for (let i = 0; i < mapElm.length; i++) {
				mapElm[i].remove();
			}
			map.innerHTML = '';
		
			new jsVectorMap({
				selector: '#world-map',
				map: 'world',
				zoomButtons: true,
				normalizeFunction: 'polynomial',
				hoverOpacity: 0.5,
				hoverColor: false,
				zoomOnScroll: false,
				series: { regions: [
					{ normalizeFunction: 'polynomial' },
				] },
				labels: { markers: { render: (marker) => marker.name } },
				focusOn: { x: 0.5, y: 0.5, scale: 1 },
				markerStyle: { initial: { fill: themeColor, r: 5 }, hover: { fill: themeColor } },
				regionStyle: { initial: { fill: inverse, fillOpacity: 0.35, stroke: 'none', strokeWidth: 0.4, strokeOpacity: 1 }, hover: { fillOpacity: 0.5 }, selectedHover: { fillOpacity: 0.5 } },
				backgroundColor: 'transparent',
				markers: [
					{ coords: [37.0902, -95.7129], style: { image: MARKURL } },
					{ coords: [55.3781, -3.4360], style: { image: MARKURL } },
					{ coords: [51.1657, 10.4515], style: { image: MARKURL } },
					{ coords: [60.1282, 18.6435], style: { image: MARKURL } },
					{ coords: [40.4637, -3.7492], style: { image: MARKURL } },
					{ coords: [-30.5595, 22.9375], style: { image: MARKURL } },
					{ coords: [36.2048, 138.2529], style: { image: MARKURL } },
					{ coords: [35.9078, 127.7669], style: { image: MARKURL } },
					{ coords: [1.3521, 103.8198], style: { image: MARKURL } },
					{ coords: [-25.2744, 133.7751], style: { image: MARKURL } },
					{ coords: [-35.6751, -71.5430], style: { image: MARKURL } },
				]
			});
		}
  }
  
  useEffect(() => {
		fetch('/assets/data/dashboard/stats.json').then(res => res.json()).then((result) => { setStatsData(result); });
		fetch('/assets/data/dashboard/server.json').then(res => res.json()).then((result) => { setServerData(result); });
		fetch('/assets/data/dashboard/country.json').then(res => res.json()).then((result) => { setCountryData(result); });
		fetch('/assets/data/dashboard/source.json').then(res => res.json()).then((result) => { setSourceData(result); });
		fetch('/assets/data/dashboard/source-chart.json').then(res => res.json()).then((result) => { setSourceChartData(result); });
		fetch('/assets/data/dashboard/product.json').then(res => res.json()).then((result) => { setProductData(result); });
		fetch('/assets/data/dashboard/activity-log.json').then(res => res.json()).then((result) => { setActivityLogData(result); });
		
		renderMap();
		
		document.addEventListener('theme-reload', () => {
			setServerChartOptions(getServerChartOptions());
			setChartOptions(getChartOptions());
			renderMap();
		});

  }, []);
	
	return (
		<div>
			<div className="row">
				{/* { statsData && statsData.length > 0 && statsData.map((stat, index) => (
					<div className="col-xl-3 col-lg-6" key={index}>
						<Card className="mb-3">
							<CardBody>
								<div className="d-flex fw-bold small mb-3">
									<span className="flex-grow-1">{stat.title}</span>
									<CardExpandToggler />
								</div>
								<div className="row align-items-center mb-2">
									<div className="col-7">
										<h3 className="mb-0">{stat.total}</h3>
									</div>
									<div className="col-5">
										<div className="mt-n2">
											<Chart type={stat.chartType} height={stat.chartHeight} options={  chartOptions[stat.chartType]} series={stat.chartData} />
										</div>
									</div>
								</div>
								<div className="small text-inverse text-opacity-50 text-truncate">
									{stat.info.length > 0 && stat.info.map((info, index) => (
										<div key={index}><i className={info.icon}></i> {info.text}</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				))} */}

				{
					statsData && statsData.length > 0 && <div className="col-xl-3 col-lg-6">
						<Card className="mb-3">
							<CardBody>
								<div className="d-flex fw-bold small mb-3">
									<span className="flex-grow-1">{statsData[0].title}</span>
									<CardExpandToggler />
								</div>
								<div className="row align-items-center mb-2">
									<div className="col-7">
										<h3 className="mb-0">{statsData[0].total}</h3>
									</div>
									<div className="col-5">
										<div className="mt-n2">
											<Chart type={statsData[0].chartType} height={statsData[0].chartHeight} options={  chartOptions[statsData[0].chartType]} series={statsData[0].chartData} />
										</div>
									</div>
								</div>
								<div className="small text-inverse text-opacity-50 text-truncate">
									{statsData[0].info.length > 0 && statsData[0].info.map((info, index) => (
										<div key={index}><i className={info.icon}></i> {info.text}</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				}

				{
					networkUsage && <div className="col-xl-3 col-lg-6">
						<Card className="mb-3">
							<CardBody>
								<div className="d-flex fw-bold small mb-3">
									<span className="flex-grow-1">NETWORK USAGE</span>
									<CardExpandToggler />
								</div>
								<div className="row align-items-center mb-2">
									<div className="col-7">
										<h3 className="mb-0">{`${networkUsage.datas[networkUsage.datas.length - 1]}GB`}</h3>
									</div>
									<div className="col-5">
										<div className="mt-n2">
											<Chart type="line" height={30} options={chartOptions.line} series={[
												{
													"name": "Sales",
													"data": networkUsage.datas
												}
											]} />
										</div>
									</div>
								</div>
								<div className="small text-inverse text-opacity-50 text-truncate">
									<div><i className="fa fa-chevron-up fa-fw me-1"></i>{`24H Max: ${networkUsage.max} GB`}</div>
									<div><i className="fa fa-shopping-bag fa-fw me-1"></i>{`24H Min: ${networkUsage.min} GB`}</div>
									<div><i className="fa fa-dollar-sign fa-fw me-1"></i>{`24H Chg%: ${networkUsage.chg}%`}</div>
								</div>
							</CardBody>
						</Card>
					</div>
				}
				
				{
					statsData && statsData.length > 0 && <div className="col-xl-3 col-lg-6">
						<Card className="mb-3">
							<CardBody>
								<div className="d-flex fw-bold small mb-3">
									<span className="flex-grow-1">{statsData[2].title}</span>
									<CardExpandToggler />
								</div>
								<div className="row align-items-center mb-2">
									<div className="col-7">
										<h3 className="mb-0">{statsData[2].total}</h3>
									</div>
									<div className="col-5">
										<div className="mt-n2">
											<Chart type={statsData[2].chartType} height={statsData[2].chartHeight} options={  chartOptions[statsData[2].chartType]} series={statsData[2].chartData} />
										</div>
									</div>
								</div>
								<div className="small text-inverse text-opacity-50 text-truncate">
									{statsData[1].info.length > 0 && statsData[1].info.map((info, index) => (
										<div key={index}><i className={info.icon}></i> {info.text}</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				}

				{
					statsData && statsData.length > 0 && <div className="col-xl-3 col-lg-6">
						<Card className="mb-3">
							<CardBody>
								<div className="d-flex fw-bold small mb-3">
									<span className="flex-grow-1">{statsData[3].title}</span>
									<CardExpandToggler />
								</div>
								<div className="row align-items-center mb-2">
									<div className="col-7">
										<h3 className="mb-0">{statsData[3].total}</h3>
									</div>
									<div className="col-5">
										<div className="mt-n2">
											<Chart type={statsData[3].chartType} height={statsData[3].chartHeight} options={  chartOptions[statsData[3].chartType]} series={statsData[3].chartData} />
										</div>
									</div>
								</div>
								<div className="small text-inverse text-opacity-50 text-truncate">
									{statsData[3].info.length > 0 && statsData[3].info.map((info, index) => (
										<div key={index}><i className={info.icon}></i> {info.text}</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				}
					
		
				<div className="col-xl-6">
					<Card className="mb-3">
						<CardBody>
							<div className="d-flex fw-bold small mb-3">
								<span className="flex-grow-1">SERVER STATS</span>
								<CardExpandToggler />
							</div>
							<div className="ratio ratio-21x9 mb-3">
								<Chart type="bar" height="100%" options={ serverChartOptions} series={serverChartData} />
							</div>
							<div className="row">
								{ serverData && serverData.length > 0 ? (  serverData.map((server, index) => (
									<div className="col-lg-6 mb-3 mb-lg-0" key={index}>
										<div className="d-flex">
											<div className="w-50px pt-3">
												<Chart type={server.chartType} height={server.chartHeight} options={chartOptions[server.chartType]} series={server.chartData} />
											</div>
											<div className="ps-3 flex-1">
												<div className="fs-10px fw-bold text-inverse text-opacity-50 mb-1">{server.name}</div>
												<div className="mb-2 fs-5 text-truncate">{ index === 0 ? `${diskUsage} GB` : server.total}</div>
												<div className="progress h-3px bg-inverse-transparent-2 mb-1">
													<div className="progress-bar bg-theme" style={{width: server.progress}}></div>
												</div>
												<div className="fs-11px text-inverse text-opacity-50 mb-2 text-truncate">
													{server.time}
												</div>
												{server.info.length > 0 ? (server.info.map((info, index) => (
													<div className="d-flex align-items-center small" key={index}>
														<i className={'bi bi-circle-fill fs-6px me-2 '+ info.class}></i> 
														<div className="flex-1">{info.title}</div>
														<div>{info.value}</div> 
													</div>
												))) : (
													<div>No records found</div>
												)}
											</div>
										</div>
									</div>
								))) : (
									<div className="col-lg-12">No records found</div>
								)}
							</div>
						</CardBody>
					</Card>
				</div>
			
			
				<div className="col-xl-6">
					<Card className="mb-3">
						<CardBody>
							<div className="d-flex fw-bold small mb-3">
								<span className="flex-grow-1">DATA CENTERS</span>
								<CardExpandToggler />
							</div>
							<div className="ratio ratio-21x9 mb-3">
								<div id="world-map" className="jvectormap-without-padding"></div>
							</div>
							<div className="row gx-4">
								<div className="col-lg-6 mb-3 mb-lg-0">
									<table className="w-100 small mb-0 text-truncate text-inverse text-opacity-60">
										<thead>
											<tr className="text-inverse text-opacity-75">
												<th className="w-50">COUNTRY</th>
												<th className="w-25 text-end">Bots</th>
												<th className="w-25 text-end">PCT%</th>
											</tr>
										</thead>
										<tbody>
											{ countryBots && countryBots.length > 0 ? (  countryBots.map((country, index) => (
												<tr key={index} className={country.class}>
													<td>{country.name}</td>
													<td className="text-end">{country.visits}</td>
													<td className="text-end">{`${country.pct}%`}</td>
												</tr>
											))) : (
												<tr>
													<td colSpan="3">No records found</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								<div className="col-lg-6">
									<Card>
										<CardBody className="py-2">
											<div className="d-flex align-items-center">
												<div className="w-70px">
													{ sourceChartData && sourceChartData.length > 0 && (
														<Chart type="donut" height="70" options={chartOptions['donut']} series={sourceChartData} />
													)}
												</div>
												<div className="flex-1 ps-2">
													<table className="w-100 small mb-0 text-inverse text-opacity-60">
														<tbody>
															{sourceData && sourceData.length > 0 ? (sourceData.map((source, index) => (
																<tr key={index}>
																	<td>
																		<div className="d-flex align-items-center">
																			<div className={'w-6px h-6px rounded-pill me-2 ' + source.class}></div>{source.name}
																		</div>
																	</td>
																	<td className="text-end">{source.percentage}</td>
																</tr>
															))) : (
																<tr>
																	<td colSpan="2">No records found</td>
																</tr>
															)}
														</tbody>
													</table>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
				{/* wxh-- */}
				{/* <div className="col-xl-6">
					<Card className="mb-3">
						<CardBody>
							<div className="d-flex fw-bold small mb-3">
								<span className="flex-grow-1">TOP PRODUCTS</span>
								<CardExpandToggler />
							</div>
							<div className="table-responsive">
								<table className="w-100 mb-0 small align-middle text-nowrap">
									<tbody>
										{productData && productData.length > 0 ? (productData.map((product, index) => (
											<tr key={index}>
												<td>
													<div className="d-flex">
														<div className={'position-relative' + ((index < (productData.length - 1)) ? ' mb-2' : '')}>
															<div className="bg-position-center bg-size-cover bg-repeat-no-repeat w-80px h-60px" style={{ backgroundImage: 'url('+ product.img +')'}}></div>
															<div className="position-absolute top-0 start-0">
																<span className={'badge rounded-0 d-flex align-items-center justify-content-center w-20px h-20px' + ((index < 3) ? ' bg-theme text-theme-900' : ' bg-black bg-opacity-50')}>{index + 1}</span>
															</div>
														</div>
														<div className="flex-1 ps-3">
															<div className="mb-1"><small className="fs-9px fw-500 lh-1 d-inline-block rounded-0 badge bg-inverse bg-opacity-25 text-inverse text-opacity-75 pt-5px">{product.sku}</small></div>
															<div className="fw-500 text-inverse">{product.title}</div>
															{product.price}
														</div>
													</div>
												</td>
												<td>
													<table className={((index < (productData.length - 1)) ? 'mb-2' : '')}>
														<tbody>
															<tr>
																<td className="pe-3">QTY:</td>
																<td className="text-inverse text-opacity-75 fw-500">{product.qty}</td>
															</tr>
															<tr>
																<td className="pe-3">REVENUE:</td>
																<td className="text-inverse text-opacity-75 fw-500">{product.revenue}</td>
															</tr>
															<tr>
																<td className="pe-3 text-nowrap">PROFIT:</td>
																<td className="text-inverse text-opacity-75 fw-500">{product.profit}</td>
															</tr>
														</tbody>
													</table>
												</td>
												<td><a href="#/" className="text-decoration-none text-inverse"><i className="bi bi-search"></i></a></td>
											</tr>
										))) : (
											<tr>
												<td colSpan="5">No records found</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>
				</div> */}
				{/* wxh-- */}
				{/* <div className="col-xl-6">
					<Card className="mb-3">
						<CardBody>
							<div className="d-flex fw-bold small mb-3">
								<span className="flex-grow-1">ACTIVITY LOG</span>
								<CardExpandToggler />
							</div>
							<div className="table-responsive">
								<table className="table table-striped table-borderless mb-2px small text-nowrap">
									<tbody>
										{activityLogData && activityLogData.length > 0 ? (activityLogData.map((log, index) => (
											<tr key={index}>
												<td>
													<span className="d-flex align-items-center">
														<i className={'bi bi-circle-fill fs-6px me-2 ' + ((log.highlight) ? 'text-theme' : 'text-inverse text-opacity-30')}></i> 
														{log.title}
													</span>
												</td>
												<td><small>{log.time}</small></td>
												<td><span className={'badge d-block rounded-0 pt-5px w-70px ' + ((log.highlight) ? 'bg-theme text-theme-900' : 'bg-inverse bg-opacity-25')} style={{ minHeight: '18px'}}>PRODUCT</span></td>
												<td><a href="#/" className="text-decoration-none text-inverse"><i className="bi bi-search"></i></a></td>
											</tr>
										))) : (
											<tr>
												<td colSpan="4">No records found</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>
				</div> */}
			</div>
		</div>
	)
};

export default Dashboard;