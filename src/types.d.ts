interface Interval {
	endTime: number;
	startTime: number;
}

export interface ThermostatInterval extends Interval {
	thermostatSetting: number;
}

export interface ThermalInterval extends ThermostatInterval {
	startTemperature: number;
	endTemperature: number;
	dutyCycle: number;
}

export interface DataSet {
	version: number;
}

export interface ThermalProperties extends DataSet {
	baseloadDutyCycle: number;
	temperatureChangeVelocity: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
}
