# Brief

**The problem is** to model and present the resource savings possible by setting a server room's time-programmable thermostat to a cooler temperature during hours when the electrical supply tariff is off-peak.

**The users are** server room operators in general and work colleagues who maintain the environment of two server rooms.

**I will find out more** by investigating available weather forecasts, utility tiers and server rooms in the local area. I will also study the critical thermal modelling characteristics and related calculus.

**The skills I will be using from level 3** will be delivering a software engineering project in an agile fashion (TM354).

**The professional skills I will be using** will be web development and data science.

**The progress beyond level 3** will be combining existing skills and mathematical modelling techniques to solve a relevant and practical problem.

**The end product I will deliver** will be a thermal management model, recommendation algorithm and presentation website. This system should fetch its data from APIs and a site survey.

**I could extend the scope** by integrating with a thermostat API, graphing the expected room temperatures, guiding the estimation of server room thermal properties, bundling for deployment as an IoT device, improving the thermal model, and extending the model to domestic and commercial use.

# Development process

## Observations

* There exists a small, well-bounded and useful product.
    * Simple data gathering comprised of a guided set of thermostat adjustments with duty cycle, temperature and ambient observations.
    * Simple thermal model comprised of fixed thermal load and only active cooling.
    * Simple recommendation algorithm, yet to be engineered.
    * Simple presentation website of a graph of anticipated costs, temperatures and duty cycles and a bottom line of savings.
* There exists a large pluripotential scope for development.
    * Any of the functional requirements expressed above can be improved.
    * Several possibilities for new functional requirements exist.
* The deployment journey is not fundamentally arduous.
    * The most arduous part of updating this product would be data migration.
    * See architecture, below.

## Decision

* This should be developed in an agile manner. (Kanban?)
    * User story cards. Backlog, priority, imagine, minimise, develop, deploy, review.
    * CI/CD is very well suited to web development projects.
* The initial delivery will be a guided data gathering process.
    * This will collect active observations of the room and observations of the ambient environment.
    * A normal agile process would aim for a minimal product that is viable, but by delivering this as early as possible it allows the project to collect wider seasonal variance.

# Architecture

## Observations

* This does not require multiple device data persistence or sharing.
* All information is coming from third party APIs or primary sources.
* The mathematical calculations are not intensive.
* There is value to this being usable without installation.
* There is value in a firm type system, to assist with data consistency.

## Decision

* This shall be deployed as a website that uses client-side data storage and processing.
* This shall be developed using typescript and compiled to javascript for deployment.

# Inputs

## Server room thermal properties

* Parts of this are potentially very difficult to survey and estimate.
    * **Minimising the complexity of this input is of utmost priority.**
    * Understanding how to calculate this will be an early priority.
    * The power of the cooler and the heat output of the servers ought to be directly readable.
    * The thermal mass of the room and the passive cooling will require research.
        * Passive cooling might be calculated from the duty cycle of the air conditioner when the interior and exterior temperatures differ.
        * Thermal mass might be calculated by adjusting the thermostat and timing the reaction.
    * Can this be calculated using only the control mechanisms available to a thermostat?
        * Leave it alone, what is the duty cycle of the air conditioner?
        * Turn the thermostat down, how long does the temperature take to come down?
        * Leave it alone, what is the duty cycle of the air conditioner?
        * Turn the thermostat back up, how long does the temperature take to rise?
        * Leave it alone, what is the duty cycle of the air conditioner?
    * Providing an example will be a significant part of early work.
    * Providing a guided survey will radically improve the utility of this project.
    * Simplifying assumptions currently applied:
        * The server room is equipment racks, well-circulated air, air conditioning and thermal mass.
            * All electricity consumed by the server hardware is converted to heat.
            * The server hardware generates a steady heat output.
            * The air conditioning performs equivalently in all temperatures.
            * The insulation within this space is insignicant.
            * The propogation of heat through this space is instantaneous.
        * Passive cooling is insignificant (citation needed)
            * This can be confirmed by observing the duty cycle during different temperature differences.
            * This allows creating and interacting with a very basic model before improving the model.
            * This eliminates integration with a weather forecast from the MVP.
            * This assumption masks "The server room is surrounded by an insulating layer" and "Outside the insulating layer is an ambient environment".
            * Early mathematical work will be conducted to eliminate this assumption.
        * The server room is surrounded by an insulating layer.
            * The thermal mass of this layer is insignificant.
            * Radiative heating and cooling effects are insignificant.
        * Outside the insulating layer is an ambient environment.
            * This ambient environment is a constant temperature.
            * There is exactly one ambient environment.
            * The server room does not affect the ambient environment.
            * Early work will apply temperature forecasts to this ambient environment, to remove some of these simplifications.
        * Thermal units, such as coefficient of production and joules of thermal energy, can probably be eliminated from the model.
            1. Passive observations measure the duty cycle required to maintain temperature differences.
            1. Active observations measure the duty time required to enact temperature changes.
            1. These are directly proportional to the resource cost required, without needing thermal units.
            1. The basic units become `duty`, `celsius` and `second`.
                * eg. Passive cooling reduces the duty cycle of the air conditioning by 3% per celsius drop.
                * eg. To change the temperature of the server room requires 3600 duty seconds per celsius.
                * eg. Running the air conditioning uses 1 ton of CO2 per 3600 duty seconds.
    * Calculating passive cooling, given a single period of observation and power consumption of server hardware:
        1. Assume the ambient temperature is constant across the period of measurement.
        1. Assume the internal temperature is constant across the period of measurement.
        1. Note the cooling capability of the air conditioner in watts.
        1. Record the duty cycle of the air conditioning as a fraction.
        1. Record the power used by the server hardware in watts.
        1. Any heat not removed by the air conditioning must have been removed by passive cooling.
        1. Heat removed by air conditioner = Air conditioner cooling rate * Air conditioner duty cycle.
        1. Heat removed by passive cooling = Server hardware power - Heat removed by air conditioner.
        1. Temperature difference = Internal temperature - Ambient temperature.
        1. Passive cooling = Heat removed by passive cooling / Temperature difference
    * Calculating passive cooling, given two periods of observation at different ambient temperatures.
        1. Assume the ambient temperature is constant across each period of measurement.
        1. Assume the internal temperature is constant across each period of measurement.
        1. Note the cooling capacity of the air conditioner in watts.
        1. Record the duty cycle of the air conditioning as a fraction.
        1. Record the power used by the server hardware in watts.
        1. Air conditioner work = Air conditioner cooling capacity * Air conditioner duty cycle.
        1. Calculate the difference in work performed by the air conditioner.
        1. Passive cooling = Difference in work / Difference in temperature.
    * Getting as much information as possible from passive observations.
        1. Record in as many ambient conditions as possible.
        1. Best fit these on a graph of watts of cooling delivered by the air conditioner vs temperature difference with ambient.
        1. The gradient of this graph is the rate of passive cooling in watts per celsius.
        1. The y-intercept of this graph is the heat output of the servers, using the zero difference in temperature.
        1. It is impossible to estimate the thermal mass of the server room in this manner since the temperature is constant.
    * Notes on active observations
        * This will change the temperature on the thermostat and record the temperature at various times after this change.
        * This is intended to calculate how quickly the server room responds to temperature changes.
        * This property cannot be derived from a passive thermostat setting since the temperature of the room does not change.
        * This property is essential for this model as it determines how much "cold" can be stored in the material of the room.
        * Some calculus will be required to account for the difference in passive cooling as the temperature difference changes.
            * This will require some best fitting.
            * This should be an exponential since this is proportional decay.
        * Active observations can be used to fabricate temperature differences, to accelerate passive observation opportunities.

## Weather or climate

### Criteria

* To automate a thermostat would require a forecast horizon that covers from the time when electricity is cheapest until the time when the day is hottest.
    * An initial estimate puts this at about midnight to noon, but further research is required.
* To manually program a thermostat would require climate information about a typical day in that location and season.
    * This could be pre-populated with sets of example data.
* To be useful an API must cover the intended location.
    * The intended initial coverage is the counties of Surrey, West Sussex, East Sussex and Kent.
* To be useful an API must allow at least 36 requests per day.
    * An automatic system is likely to update its data every few hours (estimated about 12 times a day).
    * A manual system is likely to be loaded several times (estimated about 4 times).
    * Each data import is likely to require 2-3 API requests.

### Examples

| Company       | Link                                          | Hourly forecast horizon   | Climate data available    | Quantity of locations in SE UK    | API throttle  |
| ------------- | --------------------------------------------- | ------------------------- | ------------------------- | --------------------------------- | ------------- |

## Electricity prices

* An electricity price API would allow most effective automation of this system.
* Night/Day tariff information would be enough to model the benefits for many users.
    * These could be pre-populated from examples.
    * These are also not difficult for a user to input.

### Exmaples

| Company   | Link  |
| --------- | ----- |