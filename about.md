# Brief

**The problem is** to model and present the resource savings possible by setting a server room's time-programmable thermostat to a cooler temperature during hours when the electrical supply tariff is off-peak.

**The users are** server room operators in general and work colleagues who maintain the environment of two server rooms.

**I will find out more** by investigating available weather forecasts, utility tiers and server rooms in the local area. I will also study the critical thermal modelling characteristics and related calculus.

**The skills I will be using from level 3** will be delivering a software engineering project in an agile fashion (TM354).

**The professional skills I will be using** will be web development and data science.

**The progress beyond level 3** will be combining existing skills and mathematical modelling techniques to solve a relevant and practical problem.

**The end product I will deliver** will be a thermal management model, recommendation algorithm and presentation website. This system should fetch its data from APIs and a site survey.

**I could extend the scope** by integrating with a thermostat API, graphing the expected room temperatures, guiding the estimation of server room thermal properties, bundling for deployment as an IoT device, and extending the model to domestic and commercial use.

# Inputs

## Server room thermal properties

* Parts of this are potentially very difficult to survey and estimate.
    * **Minimising the complexity of this input is of utmost priority.**
    * Understanding how to calculate this will be an early priority.
    * The power of the cooler and the heat output of the servers ought to be achievable.
    * The thermal mass of the room and the passive cooling will require research.
        * Passive cooling might be calculated from the duty cycle of the air conditioner when the interior and exterior temperatures differ.
        * Thermal mass might be calculated by adjusting the thermostat and timing the reaction.
    * Can this be calculated using only the control mechanisms available to a thermostat?
        * Turn the thermostat down, how long does the temperature take to come down?
        * Leave it alone, what is the duty cycle of the air conditioner?
        * Turn the thermostat back up, how long does the temperature take to rise?
        * Leave it alone, what is the duty cycle of the air conditioner?
    * Providing an example will be a significant part of early work.
    * Providing a guided survey will radically improve the utility of this project.

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