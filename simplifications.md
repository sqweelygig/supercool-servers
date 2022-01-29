# Simplifications

This document records the simplifying assumptions currently applied to the modelling process.
These simplifications should not be treated as final but should be justified or removed if possible.

* The server room comprises equipment racks, well-circulated air, air conditioning and thermal mass.
    * All electricity consumed by the server hardware becomes heat.
    * The server hardware generates a steady heat output.
    * The air conditioning performs equivalently in all temperatures.
    * The insulation within this space is insignificant.
    * The propagation of heat through this space is instantaneous.
* Passive cooling is insignificant (citation needed).
    * Observing the duty cycle during different ambient temperatures can confirm this.
    * Adopting this assumption unblocks creating a UX using a basic model.
    * This assumption pushes integrating with weather forecasts outside the MVP.
* An insulating layer surrounds the server room. This assumption is currently irrelevant due to "Passive cooling is insignificant".
    * The thermal mass of this layer is insignificant.
* Radiative thermal effects, e.g. through windows, are constant.
* Outside the insulating layer is an ambient environment. This assumption is currently irrelevant due to "Passive cooling is insignificant".
    * There is precisely one ambient environment.
    * The server room does not affect the ambient environment.
* Thermal units, such as coefficient of production and joules of thermal energy, can probably be eliminated from the model.
    * Passive observations measure the duty cycle required to maintain temperature differences.
    * Active observations measure the duty time required to enact temperature changes.
    * Duty cycle is directly proportional to the resource cost required without needing thermal units.
    * The basic units become `duty`, `celsius` and `hour`.
        * e.g., maintaining a steady temperature requires a 50% duty cycle
        * e.g., passive cooling reduces the duty cycle of the air conditioning by 3% per celsius difference.
        * e.g., changing the server room's temperature requires one duty hour per celsius.
        * e.g., running the air conditioning uses 1 ton of CO2 per duty hour.