<template>
	<tool-bar
		v-on:next="onNext"
		v-on:previous="onPrevious"
		v-bind:download="download"
		download-name="chart.png"
	/>
	<page-header text="Schedule Chart" />
	<div ref="chartArea" class="chart-area"></div>
	<vertical-spacer />
	<tool-bar
		v-on:next="onNext"
		v-bind:download="download"
		download-name="chart.png"
	/>
</template>

<style lang="scss">
div.chart-area {
	aspect-ratio: 1;
}
.bb-regions {
	.duty-0 {
		fill: black;
		fill-opacity: 0;
	}
	.duty-1 {
		fill: black;
		fill-opacity: 0.02;
	}
	.duty-2 {
		fill: black;
		fill-opacity: 0.04;
	}
	.duty-3 {
		fill: black;
		fill-opacity: 0.06;
	}
	.duty-4 {
		fill: black;
		fill-opacity: 0.08;
	}
	.duty-5 {
		fill: black;
		fill-opacity: 0.1;
	}
	.duty-6 {
		fill: black;
		fill-opacity: 0.12;
	}
	.duty-7 {
		fill: black;
		fill-opacity: 0.14;
	}
	.duty-8 {
		fill: black;
		fill-opacity: 0.16;
	}
	.duty-9 {
		fill: black;
		fill-opacity: 0.18;
	}
	.duty-10 {
		fill: black;
		fill-opacity: 0.2;
	}
	.duty-11 {
		fill: black;
		fill-opacity: 0.22;
	}
	.duty-12 {
		fill: black;
		fill-opacity: 0.24;
	}
	.duty-13 {
		fill: black;
		fill-opacity: 0.26;
	}
	.duty-14 {
		fill: black;
		fill-opacity: 0.28;
	}
	.duty-15 {
		fill: black;
		fill-opacity: 0.3;
	}
	.duty-16 {
		fill: black;
		fill-opacity: 0.32;
	}
}
</style>

<script lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import { defineComponent, PropType } from "vue";
import VerticalSpacer from "@/components/VerticalSpacer.vue";
import { TariffSchedule } from "@/tariff-survey/TariffSurvey.types";
import {
	ThermalInterval,
	ThermalProperties,
} from "@/thermal-survey/ThermalSurvey.types";
import optimiseSchedule from "@/pipes/OptimiseSchedule.pipe";
import { ThermostatInterval } from "@/SuperCoolServers.types";
import modelSchedule from "@/pipes/ModelSchedule.pipe";
import { bb, line } from "billboard.js";
import "billboard.js/dist/billboard.css";

export default defineComponent({
	// TODO Explain steps required for successful chart output
	components: { PageHeader, ToolBar, VerticalSpacer },
	computed: {
		thermostatSchedule(): ThermostatInterval[] {
			return optimiseSchedule(
				this.tariffSchedule.intervals,
				this.thermalProperties
			);
		},
		thermalPredictions(): ThermalInterval[] {
			return modelSchedule(this.thermostatSchedule, this.thermalProperties);
		},
		thermostatSeries(): Array<{ time: Date; value: number }> {
			const thermostatSeries: Array<{ time: Date; value: number }> = [];
			this.thermostatSchedule.forEach((thermostatInterval) => {
				thermostatSeries.push({
					time: thermostatInterval.startTime,
					value: thermostatInterval.thermostatSetting,
				});
				thermostatSeries.push({
					time: thermostatInterval.endTime,
					value: thermostatInterval.thermostatSetting,
				});
			});
			return thermostatSeries;
		},
		predictedTemperatureSeries(): Array<{ time: Date; value: number }> {
			const predictionSeries: Array<{ time: Date; value: number }> = [];
			this.thermalPredictions.forEach((thermalPrediction) => {
				predictionSeries.push({
					time: thermalPrediction.startTime,
					value: thermalPrediction.startTemperature,
				});
				predictionSeries.push({
					time: thermalPrediction.endTime,
					value: thermalPrediction.endTemperature,
				});
			});
			return predictionSeries;
		},
		tariffSeries(): Array<{ time: Date; value: number }> {
			const costSeries: Array<{ time: Date; value: number }> = [];
			this.tariffSchedule.intervals.forEach((tariffInterval) => {
				costSeries.push({
					time: tariffInterval.startTime,
					value: tariffInterval.costPerHour,
				});
				costSeries.push({
					time: tariffInterval.endTime,
					value: tariffInterval.costPerHour,
				});
			});
			return costSeries;
		},
	},
	data() {
		return {
			download: undefined as undefined | string,
		};
	},
	mounted: function () {
		const chart = bb.generate({
			axis: {
				x: {
					label: {
						position: "outer-center",
						text: "Time of day",
					},
					localtime: true,
					tick: {
						autorotate: true,
						culling: {
							max: 5,
						},
						fit: false,
						format: "%H:%M",
						rotate: 45,
					},
					type: "timeseries",
				},
				y: {
					label: {
						position: "outer-middle",
						text: "Temperature (°C)",
					},
					tick: {
						culling: {
							max: 5,
						},
						stepSize: 1,
					},
				},
				y2: {
					label: {
						position: "outer-middle",
						text: `Cost (${this.tariffSchedule.units} per hour)`,
					},
					show: true,
					tick: {
						culling: {
							max: 5,
						},
					},
				},
			},
			bindto: this.$refs.chartArea,
			data: {
				axes: {
					"Thermostat Schedule": "y",
					"Predicted Temperature": "y",
					"Running Cost": "y2",
				},
				colors: {
					"Duty Cycle": "rgba(0,0,0,0.32)",
					"Predicted Temperature": "rgb(0,0,255)",
					"Running Cost": "rgb(255,0,0)",
					"Thermostat Schedule": "rgb(0,208,0)",
				},
				columns: [
					[
						"Thermostat Times",
						...this.thermostatSeries.map((thermostatPoint) => {
							return thermostatPoint.time;
						}),
					],
					[
						"Thermostat Schedule",
						...this.thermostatSeries.map((thermostatPoint) => {
							return thermostatPoint.value;
						}),
					],
					[
						"Prediction Times",
						...this.predictedTemperatureSeries.map((temperaturePoint) => {
							return temperaturePoint.time;
						}),
					],
					[
						"Predicted Temperature",
						...this.predictedTemperatureSeries.map((temperaturePoint) => {
							return temperaturePoint.value;
						}),
					],
					[
						"Tariff Times",
						...this.tariffSeries.map((tariffPoint) => {
							return tariffPoint.time;
						}),
					],
					[
						"Running Cost",
						...this.tariffSeries.map((tariffPoint) => {
							return tariffPoint.value;
						}),
					],
					["Duty Cycle", null],
					["Duty Times", null],
				],
				type: line(),
				xs: {
					"Thermostat Schedule": "Thermostat Times",
					"Predicted Temperature": "Prediction Times",
					"Running Cost": "Tariff Times",
					"Duty Cycle": "Duty Times",
				},
			},
			point: {
				show: false,
			},
			regions: this.thermalPredictions.map((thermalPrediction) => {
				const roundedDuty = Math.round(thermalPrediction.dutyCycle * 16);
				return {
					class: `duty-${roundedDuty}`,
					end: thermalPrediction.endTime,
					start: thermalPrediction.startTime,
				};
			}),
		});
		chart.export(undefined, (dataUrl) => {
			this.$data.download = dataUrl;
		});
	},
	props: {
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
		tariffSchedule: {
			required: true,
			type: Object as PropType<TariffSchedule>,
		},
		thermalProperties: {
			required: true,
			type: Object as PropType<ThermalProperties>,
		},
	},
});
</script>
