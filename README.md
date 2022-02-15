# An application to inform the proactive cooling of server rooms

Inspired by ["Batteries aren't the only way to store power. Here's another."](https://www.youtube.com/watch?v=0f9GpMWdvWI) from Technology Connections.

## Motivation

As humanity seeks to manage its impact on Earth, electricity generation from low-carbon sources such as wind and solar will increase.
However, weather drives wind and solar power generation and is intermittent.
There are various techniques to account for this intermittency, such as battery storage, usage shaping and alternative baselines.
This project will focus on demand-side usage offsetting, which can form a valuable component of opportunity-oriented electrical grids.

Server rooms in temperate environments usually require active cooling from air conditioning units.
For example, the Brighton Digital Exchange (BDX) requires active cooling to offset the heat generated by the equipment and does not require other heat sources (Airedale, 2015).
However, this cooling increases the operating expenses of a server room, whether measured in terms of currency, kilowatt-hours or greenhouse gas emissions.
By reducing these expenses, operators may achieve a more efficient server room without significant capital expense or reduction in quality.

Thermal mass reduces the rate at which temperature changes occur and, in this context, can be used as energy storage.
For example, a schedule may set the target temperature on an air-conditioner thermostat to a cooler temperature when electricity is cheaper.
As a result, the air-conditioner will draw more heat energy from the room than routine operations require, and the thermal mass will cool.
Conversely, the same schedule may resume the normal target temperature during expensive electricity tariffs.
The thermal mass, being colder than the target temperature and the passive equilibrium of the room, will absorb some heat energy and slow the room's warming.
This offsetting of operation through time is equivalent to storing energy when power is cheap and using it when power is expensive.

## Deliverables

This project will create an application to steer an operator towards more efficient scheduling.
It will gather the data required via a survey, model the thermal characteristics of the room, compute an optimised thermostat schedule and present the forecast savings.
The project assumes that its audience is technical, consistent with having some responsibility for a server room's environmental controls.

The system cannot assume that the server room has a smart thermostat since its purposes include justifying such an expense.
Therefore, to gather the dataset, a technician might observe the thermal properties of the server room.
The dataset required to compute the desired report is not trivial, so a guided survey will improve accuracy, reliability and uptake.
Furthermore, this survey is likely to be conducted on a portable device, so interface development should support small screen sizes.

The system will mathematically model the thermal properties of the server room through time in different configurations.
This modelling will allow the comparison of configurations in a printable, business-oriented report.
One of these configurations will be computed algorithmically, with this algorithm being developed and implemented during the project.

## Lifecycle

This project has a firm time budget, which must be respected when considering scope.
The 32-week lifecycle budgets 7.5 hours to project work per week.
This budget resolves to about six full-time equivalent weeks.

In choosing the software development model, the first consideration is positioning on the spectrum from waterfall to agile.
This project has a small, well-bounded and useful product within a sizeable pluripotential scope for development.
For example, the MVP could consist of a data-gathering flow, a simplified thermal model, a schedule optimisation algorithm and a brief final report.
Alongside architecture decisions and toolchain initialisation, this MVP will require an estimated 70% of the project budget.
The scope for improving this offering includes iteratively improving any of these functional requirements, adding integration with APIs, the internet of things, and more accurate modelling.
It is also worth noting that it is not a critical system and the project commissioners require several milestones.
In conclusion, this project will be organised in an agile fashion, prompted mainly by the relative scale of MVP and potential.
The MVP development will be a series of small increments, with further development being incremental or iterative as required.

![Graphical summary of the MVP from the paragraph above](mvp.png)
Figure n.n - Initial project outline, showing boundaries of MVP.

There are several models for agile software development with varying suitability for project contexts.
For example, this project team is a single developer, so there is little value in specific roles and coordination events.
During the initial lifecycle of this project, the product will be a website, which would encourage continuous improvement and continuous delivery.
In contrast, if the product develops beyond this project, there is value to targetting an IoT context.
This context would suggest a more discrete deployment model, but a continuous pipeline can easily adopt pinned releases.
Based on these observations and the principle of only adding processes when they add value, the project development model will be Kanban.

The first delivered use case will be an assisted survey of a site's thermal properties.
This use case is selected because the project runs from February to September, so collecting data as early as possible will cover a more significant seasonal variance.
At the other end of the project lifecycle, the final submission should include options for future development, captured as backlog cards.
The product potential exceeds the project budget, but there is still value in recording these options.

## Architecture

![Overview of gathering data, optimising schedule and presenting report](overview_diagram.png)
Figure n.n - Activity diagram showing data flow for optimising a schedule and presenting a report.

In deciding the deployment artefacts, there are several pertinent aspects.
First, all the data driving this model is from the primary observations of the technician or third party APIs.
Second, the modelling expected is not intensive, so calculation performance is a minor factor.
Third, there is value to data communication and sharing, but this is not an essential feature.
Finally, this should be available without installation as a significant proportion of users are likely to be single-use.
These requirements suit deployment as a stand-alone website using client-side data retention and processing.

Due to the project time constraints, the language and framework must be familiar to the developer.
In addition, the project is quite data-centric, so it favours a strong type system.
Alongside this, the immediate context for deployment is the web, so the language choice must support this.
Finally, there is also potential for IoT and mobile deployments, which should steer consideration.
Within these criteria, TypeScript seems the best choice for language.
It has a modern type system, is compilable to ECMAScript for web deployment, can be executed in Node.js for IoT deployment and is familiar to the developer.
One concern is its deployability as a mobile app, but the *-native projects should accommodate this.

The selection of a user interface framework is more balanced than language but with a couple of early eliminations.
First, direct DOM manipulation is not sustainable or manageable.
Secondly, server-side rendering of the DOM adds unnecessary components, specifically server-side processing.
Therefore client-side reactive web frameworks were considered.
As tie-breakers, the Vue.js experience was more developer-friendly, and it has a higher quantity of GitHub stars.
In conclusion, this project will use Vue.js, especially single file components, but this was a close decision.

| Language      | Types     | Deployability | Familiarity   |
| ------------- | --------- | ------------- | ------------- |
| Java          | Strong    | N/A           | Low           |
| ECMAScript    | None      | Web, IoT      | High          |
| TypeScript    | Strong    | Web, IoT      | High          |
| Python        | Weak      | IoT           | Medium        |
| Dart          | Strong    | Web, Mobile   | Low           |

| HTML Framework    | Familiarity   | Suitability   | GitHub Stars  |
| ----------------- | ------------- | ------------- | ------------- |
| Server-side       | Medium        | Low           | N/A           |
| Direct DOM        | Medium        | Low           | N/A           |
| React             | Low           | High          | 182k          |
| Vue               | Low           | High          | 193k          |

Figure n.n - Feature comparison matrix of language options.

## Work Completed

For several reasons, gathering a set of thermal observations was a vital early milestone and this received priority above other concerns.
First, gaining access to an example server room provides a case study, and gathering these observations proved that access.
Furthermore, these observations will inform and verify modelling assumptions, which is improved by gathering these observations across as wide a range of seasons as possible.

Several elements were required to script this set of observations.
Most importantly, research into the thermal behaviour of rooms was conducted and supplemented by a quick survey of the room available.
This research ensured that any detailed survey taken suited a fully formed model.
Since such a model would require calculations of how rapidly a room could change temperature, permission to adjust the room's thermostat was negotiated.
The quick survey revealed that the server room windows are north facing and boarded over, so the initial model can ignore radiative thermal effects.

Figure n.n - Plan of the server room surveyed

To support this survey, the developer initialised the UI of this project, designed the survey's workflow, and implemented this in the interface.
The UI consists of a reactive website with custom data-gathering components, targetting low resolutions and touchscreen interaction to support smartphone usage.
Within this, the survey observes the room as it moves between and maintains different temperatures. As a result, this data should support an intermediate thermal model.

Figure n.n - Overview of the thermal survey workflow.

Figure n.n - Web interface at 360 x 640

## Simplifications

This section records the simplifying assumptions currently applied to the modelling process. These simplifications should not be treated as final but should be justified or removed if possible.
* The server room comprises equipment racks, well-circulated air, air conditioning and thermal mass.
  * All electricity consumed by the server hardware becomes heat.
  * The server hardware generates a steady heat output.
  * The air conditioning performs equivalently in all temperatures.
  * The insulation within this space is insignificant.
  * The propagation of heat through this space is instantaneous.
* Passive cooling is insignificant.
  * Observing the duty cycle during different ambient temperatures can confirm this.
  * Adopting this assumption unblocks creating a UX using a basic model.
  * This assumption pushes integrating with weather forecasts outside the MVP.
* An insulating layer surrounds the server room. This assumption is currently irrelevant due to "Passive cooling is insignificant".
  * The thermal mass of this layer is insignificant.
  * Radiative thermal effects through windows are constant.
* Outside the insulating layer is an ambient environment. This assumption is currently irrelevant due to "Passive cooling is insignificant".
  * There is precisely one ambient environment.
  * The server room does not affect the ambient environment.
* Thermal units, such as coefficient of production and joules of thermal energy, can be eliminated from the model.
  * Passive observations measure the duty cycle required to maintain temperature differences.
  * Active observations measure the duty time required to enact temperature changes.
  * The duty cycle is directly proportional to the resource cost required without needing thermal units.
  * The basic units become `duty`, `celsius` and `hour`.
    * e.g., passive cooling reduces the duty cycle of the air conditioning by 3% per celsius difference.
    * e.g., changing the server room's temperature requires one duty hour per celsius.
    * e.g., running the air conditioning uses 1 ton of CO2 per duty hour.

## Roadmap

In line with the project lifecycle adopted, this is several lists of stakeholder stories, each in the format `A (stakeholder) (must|should|could|will not) …`.
These stories will move in step with the code that implements them and reside in the code repository, so the project history is always accurate of that moment in time.

### Backlog

* A technician should be able to model rooms with significant passive cooling.
* A technician could integrate this with live data from weather forecasts.
* A technician could integrate this with live data from electricity tariffs.
* A developer could use this model and algorithm in a smart thermostat.
* A technician could use this system to control a smart thermostat.
* A commercial environment could use this system.
* A domestic environment could use this system.

### Priorities

* A technician should have information on an example server room available.
* A technician must be able to input a baseline thermostat schedule.
* A technician must be able to input an electricity tariff schedule.
* A technician must be able to generate an optimised thermostat schedule.
* A technician must be able to generate a business-oriented report.
* A technician must be able to gather thermal observations of a server room.

### Design

### Develop

### Review

### Qualitative

* A technician could use this system without installation.
* A technician should be able to understand how the system processes data.
* A technician should be able to use this system despite accessibility challenges.
* A technician could use this system on a low-resolution touchscreen interface, such as a smartphone.

## Blockers

To achieve the task, "A technician should have information on an example server room available." the project requires permission to observe and adjust the thermostat of a server room.
This permission is critical as the risk has a high likelihood and high impact.
This concern is likely because the temperature is a tightly controlled aspect of a server room.
Furthermore, it is impactful because this example provides feedback about the user experience and gives the project a case study. 

Therefore, negotiation-in-principle started immediately upon beginning the project to bring any related decision point forwards.
Now that we have outlined a survey workflow, the developer is negotiating access to perform the required tasks.
If this negotiation fails, the project may continue without a case study or transition to modelling a more available example of thermodynamics and power offsetting, such as domestic refrigerators.

To achieve or defer the task, "A technician should be able to model a room with significant passive cooling." the project must incorporate learning into the mathematics of thermodynamic cooling.
Failing in this learning is of medium likelihood as the science is sure to be public domain but is also likely to be intermediate.
In addition, this research is of high impact as it can underwrite and prioritise other simplifications.

Therefore, achieving a basic understanding of this field is second only to finding an engaging case study, and is the target of early secondary research efforts.

## Thermodynamics

There are multiple routes by which a server room sheds heat.
Principal among these will be the air conditioning systems which good practice states will exceed the cooling requirements using an N + 1 redundant infrastructure.
The room will also conduct heat through its surface area to both indoor and outdoor environments.
This cooling is all set against the heat a room generates from the servers it contains.

Figure n.n - Building management system (BMS) interface

Two 51.6kW air conditioning units cool the BDX for a total cooling power of 103.2kW.
This infrastructure is N + 1 redundant, implying a cap upon server equipment at 51.6kW before upgrades.
The BDX complements this with precision units that cool the server equipment by heating the thermal mass of the room.

The BMS holds the room at 20 degrees celsius, and the external temperature varies between 3 and 20 degrees celsius.
The external wall comprises an uninsulated stud wall, an access corridor and a single pane glass wall of about 23 m².
An upper estimate of cooling through this wall (rounded up to 1 s.f.) is 1 kilowatt (see Appendix n).
This estimate diminishes the importance of modelling weather conditions in this situation.

The remaining surfaces of the BDX separate the room from other offices and underground.
The calculations model a 2 kelvin difference with the data hall to estimate significance.
An upper estimate of cooling through the floor, ceiling, internal, and underground walls is 900 watts (rounded up to 1 s.f.) (see Appendix n) for a passive cooling total of up to 2 kilowatts.
This estimate puts a medium prioritisation on modelling passive cooling.

Although further research is warranted and scheduled, these relative significances seem generalisable.
These building materials and styles are typical, and a quick survey of case studies confirms this.

Figure n.n - Quick survey of typical server room construction

## Glossary

| Term          | Definition                                                                    |
| ------------- | ----------------------------------------------------------------------------- | 
| Technician    | An individual who maintains the environmental conditions of a server room.    |

## Bibliography

| Title                                                           | Publisher               | Publication Date  | Link                                                                                                | Accessed    | Summary of Relevance  |
| --------------------------------------------------------------- | ----------------------- | ----------------- | --------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| Batteries aren't the only way to store energy. Here's another.  | Technology Connections  | 2021-07           | <https://www.youtube.com/watch?v=0f9GpMWdvWI>                                                       | 2021-11-21  | Project inspiration   |
| Kanban vs Scrum                                                 | Atlassian               | 2018-08           | <https://www.atlassian.com/agile/kanban/kanban-vs-scrum>                                            | 2021-12-11  | Development process   |
| What is Kanban?                                                 | Kanbanize               | 2017-06           | <https://kanbanize.com/kanban-resources/getting-started/what-is-kanban>                             | 2022-01-02  | Development process   |
| The Scrum Guide                                                 | Scrum Guides            | 2020-11           | <https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf>                             | 2022-01-02  | Development process   |
| Manifesto for Agile Software Development                        | Agile Alliance          | 2001-02           | <https://agilemanifesto.org>                                                                        | 2022-01-02  | Development process   |
| What is a Web Framework, and Why Should I use one?              | We Learn Code           | 2020-04           | <https://welearncode.com/what-are-frontend-frameworks>                                              | 2022-01-29  | Language choice       |
| vuejs/vue: Vue.js is a progressive, incrementally-adoptable ... | You, E                  | 2021-06           | <https://github.com/vuejs/vue>                                                                      | 2022-01-29  | Language choice       |
| facebook/react: A declarative, efficient, and flexible ...      | Facebook                | 2021-03           | <https://github.com/facebook/react>                                                                 | 2022-01-29  | Language choice       |
| How To Use TypeScript with Vue Single File Components           | DigitalOcean            | 2020-09           | <https://www.digitalocean.com/community/tutorials/vuejs-using-typescript-with-vue>                  | 2022-01-30  | Technical guide       |
| Creating A Custom Range Input That Looks Consistent Across ...  | Smashing Magazine       | 2021-12           | <https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers>            | 2022-02-02  | Technical guide       |
| Styling and Customizing File Inputs the Smart Way               | Valutis, O              | 2015-09           | <https://tympanus.net/codrops/2015/09/15/styling-customizing-file-inputs-smart-way>                 | 2022-02-13  | Technical guide       |
| Brighton Digital Exchange Data Centre                           | Sudlows                 | 2015-07           | <https://www.sudlows.com/wp-content/uploads/2016/07/Brighton-Digital-Exchange.pdf>                  | 2022-02-14  | Case study            |
| ACIS provides the big picture at Brighton Digital Exchange      | Airedale                | 2015-07           | <https://www.airedale.com/case-studies/acis-provides-the-big-picture-at-brighton-digital-exchange>  | 2022-02-14  | Case study            |
| Energy in buildings                                             | OpenLearn               | 2019-03           | <https://www.open.edu/openlearn/nature-environment/energy-buildings/content-section-2>              | 2022-02-15  | Modelling data        |
| Environmental design : CIBSE guide A. 8th ed.                   | CIBSE.                  | 2015              | <https://app.knovel.com/kn/resources/kpEDCIBSE1/toc>                                                | 2022-02-15  | Modelling data        |
| server room at DuckDuckGo                                       | DuckDuckGo              | 2022-02           | <https://duckduckgo.com/?q=server+room&t=h_&iax=images&ia=images>                                   | 2022-02-15  | Quick case studies    |
| What is Agile?                                                  | Atlassian               | 2019              | <https://www.atlassian.com/agile>                                                                   | 2022-02-15  | Development process   |

## To Read

Aizawa, N. (2020) ‘Study on a Cooling System with Power Usage Effectiveness of 1.02 for Server Rooms’, ASHRAE transactions, 126(1), p. 212–.
Koch, B. and Slezak, D. (2017) ‘Poster Abstract: Less energy, more efficiency in server rooms and data centers: A campaign by the Swiss Telecommunications Association’, Computer science (Berlin, Germany), 33(1-2), pp. 251–252. doi:10.1007/s00450-017-0369-0.
Sasakura, K. et al. (2020) ‘Rack Temperature Prediction Model Using Machine Learning after Stopping Computer Room Air Conditioner in Server Room’, Energies (Basel), 13(17), p. 4300–. doi:10.3390/en13174300.
Sasakura, K. et al. (2020) ‘A Temperature-Risk and Energy-Saving Evaluation Model for Supporting Energy-Saving Measures for Data Center Server Rooms’, Energies (Basel), 13(19), p. 1–. doi:10.3390/en13195222.
Nada, S.A. et al. (2017) ‘Experimental parametric study of servers cooling management in data centers buildings’, Heat and mass transfer, 53(6), pp. 2083–2097. doi:10.1007/s00231-017-1966-y.
Macedo, D. et al. (2019) ‘A Parametric Numerical Study of the Airflow and Thermal Performance in a Real Data Center for Improving Sustainability’, Applied sciences, 9(18), p. 3850–. doi:10.3390/app9183850.
Duda, S.W. (2018) ‘N+1 HVAC for IT Closets And Server Rooms’, ASHRAE journal, 60(5), p. 56–.
