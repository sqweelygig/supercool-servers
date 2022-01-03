# A website to inform proactive cooling of server rooms with the intent of reducing resource consumption

Inspired by "Batteries aren't the only way to store power. Here's another." from Technology Connections.

Demand-side energy management is useful for opportunistic electricity grids. As humanity seeks to manage its impact on Earth, electricity generation from low-carbon sources such as wind and solar will increase. However, weather drives wind and solar power generation and is intermittent. There are various techniques to account for this intermittency, such as battery storage, usage shaping and alternative baselines. This project will focus on demand-side usage offsetting.

The equipment within the server rooms studied generate enough heat that the room needs active cooling and does not require other heat sources. These thermal properties are typical of server rooms within a temperate environment. Cooling these rooms increases the operating expenses of a server room, whether measured in terms of currency or greenhouse gas emissions. By reducing these expenses, operators may achieve a more efficient server room without significant capital expense or reduction in quality.

Thermal mass reduces the rate at which temperature changes occur and, in this context, can be used as energy storage. For example, when electricity is less expensive, a schedule may set the target temperature on an air-conditioner thermostat to a cooler temperature. As a result, the air-conditioner will draw more heat energy from the room than routine operations require, and the thermal mass will cool. Conversely, a schedule may set the target temperature to a warmer temperature when electricity is more expensive. The thermal mass, being colder than the target temperature and the rest temperature of the room, will absorb some heat energy and slow the room's warming. This offsetting of operation is equivalent to storing energy when power is cheap and using it when power is expensive.

This project will create a website that can guide a technical user through gathering the data required, model the thermal characteristics of the room, compute an optimised thermostat schedule and present the forecast savings. The project assumes that its audience is at a technical level consistent with having some responsibility for a server room's environmental controls.

## Initial Q&A

**The problem is** to model, guide and present the resource savings possible by setting a server room's time-programmable thermostat to a cooler temperature during hours when the electrical supply tariff is off-peak.

**The users are** server room operators in general and work colleagues who maintain the environment of two server rooms.

**I will find out more** by investigating available weather forecasts, utility tiers and server rooms in the local area. I will also study the critical thermal modelling characteristics and related calculus.

**The skills I will be using from level 3** will be delivering a software engineering project in an organised fashion (TM354).

**The professional skills I will be using** will be web development and data science.

**The progress beyond level 3** will be combining existing skills and mathematical modelling techniques to solve a relevant and practical problem.

**The end product I will deliver** will be a thermal management model, recommendation algorithm and presentation website. This system should fetch its data from APIs and a site survey.

**I could extend the scope** by integrating with a thermostat API, graphing the expected room temperatures, guiding the estimation of server room thermal properties, bundling for deployment as an IoT device, improving the thermal model, and extending the model to domestic and commercial use.

## Development process

### Observations on agile vs plan-based development

* There exists a small, well-bounded and useful product.
    * Simple data gathering comprised of a guided set of thermostat adjustments with duty cycle, temperature and ambient observations.
    * Simple thermal model comprised of fixed thermal load and active cooling without any passive cooling.
    * Simple recommendation algorithm, *yet to be outlined*.
    * Simple presentation website of a graph of anticipated costs, temperatures and duty cycles and a bottom-line summary of savings.
* There exists a large pluripotential scope for development.
    * Any of the functional requirements expressed above can be improved.
    * Several possibilities for new functional requirements exist.
* The deployment pipeline is not fundamentally arduous.
    * The most arduous part of updating this product would be data migration.
    * See architecture, below.

### Decision on agile vs plan-based development

* This should be developed in an agile manner (*citation needed*).
* The initial delivery will be a guided data gathering process.
    * This will guide active observations of the room and observations of the ambient environment.
    * By delivering this as early as possible it allows the project to collect wider seasonal variance.

### Observations on specific agile model

* CI/CD is very well suited to web development projects.
* The project team is a single developer.
    * There is no benefit from specific roles in this context.
    * There is no benefit from cycle based synchronisation in this context.

### Decision on specific agile model

* Kanban. (*citation needed*) (kanplan?) (scrumban?) (why not UP?)
    * Each card should be at least a stakeholder story and can accumulate additional details such as designs, considerations, prerequisite cards and models.
    * The columns will be backlog, priority, design, develop and review.
        * The backlog column will be the starting column for all ideas. There shall be no barrier to entry upon this column. A card will progress from this column into priority when it is in the most important 16%. A card may move from this column directly into the archive if it is deemed to be detrimental to the project.
        * The priority column will be for cards that are important. A card may regress from this column into backlog if more important cards displace it. A card may progress from this column into design when a team member takes ownership of it.
        * The main actions for cards in the design column will be imagination, specification, decomposition and minimisation. A card may progress from this column into develop when actionable understanding has been reached. A card is likely to generate new cards as a consequence of the decomposition and minimisation processes, which are generally assumed to be priorities.
        * While implementing a stakeholder story, its card should be in the develop column. A card may progress from this column to review when the developer believes it to be complete. A card may move from this column into design if scrutiny reveals that more clarification is required.
        * During review a development arc is reviewed for correctness and utility and then deployed. This will also include a reflection on whether the card's journey revealed issues with the system itself. Once a card progresses from this column it is archived. A card may regress from this column to design if developmnet revealed the need for better guidance. Cards should not regress from this column to develop. For a card to be in this category the developer believes the development meets the design, if this is false then further design clarification is required.
    * The final submission should include cards in the backlog and priority columns.
        * The scope for the product is much larger than the scope for the project, but agile development processes incorporate this well.
        * It is expected that cards in design, develop and review are receiving active effort and so should not be part of a delivered project milestone. 

## Architecture

### Observations

* This does not require multiple device data persistence or sharing.
* All information is coming from third party APIs or primary sources.
* The mathematical calculations are not intensive.
* There is value to this being usable without installation.
* There is value in a firm type system, to assist with data consistency.

### Decision

* This shall be deployed as a website that uses client-side data storage and processing.
* This shall be developed using typescript and compiled to javascript for deployment.

## Inputs

### Server room thermal properties

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

### Weather or climate

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

| Company       | Link                                          | Hourly forecast horizon   | Climate data available    | Quantity of locations in SE UK    | API throttle  |
| ------------- | --------------------------------------------- | ------------------------- | ------------------------- | --------------------------------- | ------------- |

### Electricity prices

* An electricity price API would allow most effective automation of this system.
* Night/Day tariff information would be enough to model the benefits for many users.
    * These could be pre-populated from examples.
    * These are also not difficult for a user to input.

| Company   | Link  |
| --------- | ----- |