https://playground.d2lang.com/?script=jJK9buMwEIR7PsVAvSyfbd0ZLK655lI4CGAEKQ2aXtlEJFJYrqwiyLsHlOMfKD9Ipd3Z0YchdmMXW7KisT4VeFGAs8FrHETaqIui7_tJPO6Z2jCxoSniIfRFOZ_Nf8-LLhLnppb8V7KoV6UqDl7I7zSeaAvTtrWzRlzwPyUvynI6XRY9baMTOmNdEI1s3fGRXF0bbwn_De96w5TdkLPv0X-Wi3JZxBtKbk1DbPKKifJZ-iVTCjipGv-GrwKakN6wieRjYI3V0GI9tGnsLIf2EDxprC61AloOlmJ0fr_pvBONh4uAR-9EAZ6kD_y8cV6IK2NJ4_4k4e4sXTMh_zuGjuN9YbnE-nw-UpLpQ7K0ifeLSfNhKZWxztSoyEjHFBGFyTRpYclyPYeRT70FAAD__w%3D%3D&

```d2
suspect: Suspect {
  icon: https://www.svgrepo.com/show/532363/user-alt-1.svg
}

frontend: Web application {
  icon: https://www.svgrepo.com/show/455008/website.svg
}

iot: "Surveillance Hardware" {
  icon: "https://www.svgrepo.com/show/478458/surveillance-camera-free-2.svg"

  camera: Camera
  motion_sensor: Motion Sensor
  microphone: Microphone
  processing_unit: Processing Unit
  network_interface: Network Interface

  camera -> processing_unit
  motion_sensor -> processing_unit
  microphone -> processing_unit
  processing_unit -> network_interface
}

suspect -> iot: facial features stream
iot -> frontend: facial features
```
