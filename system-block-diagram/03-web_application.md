https://playground.d2lang.com/?script=jFPNjtMwEL77KUa9ZxPSdik5gFBXiD0gJDhwjKb2hFg4seVxGlWo746cn10iZXd7i2fm-5tOuWNHMhTwc_yAvwJAS9sWUIfguEjTvu_v-Pzbk7N30jYp17ZP99t8e79NOyafoAnJuzgirsJWlZYaTQHfp6-bGbNdluWps0ZLSphk53W4JOO7wXYS0HYw68-kjcFWEnxFr3r0dKvQ7v1htz-k_B9HIrEhj0nliZJ8Ujqh_EOtKuBobKeAyZ_J35wm_3C4z9MRlDgM9eyfS-l1o1s0paJAMpAq4JHhOFU_DRJco6MClMbGtkpchai8bcPgZ_OLToDOGS0xaNtubk6-32fZIe3pxDrQYChKjb98qTBgqVvXhQI28zk8YEB4jMWNABjXVFZEqlSancFLAZvjUIUvRAoexmocRkM-lHzhQE2cmvLBNwyyhs-xywPpvA5P0voF8Qz5MXSeya9CTK4h-QjzZu7WklSEofPE8XAWw6tZakLFtQ3iFc7I8nQbs43YFq9xL1BPMlMlNtcOY_VaFimWSx5eb4Ne3PjcgLHB4i1IpH3-y78MX7P5LwAA__8%3D&

```d2
suspect: Suspect {
  icon: https://www.svgrepo.com/show/532363/user-alt-1.svg
}
official: Official {
  icon: https://www.svgrepo.com/show/504002/police-security-policeman.svg
}
iot: Surveillance Hardware {
  icon: https://www.svgrepo.com/show/478458/surveillance-camera-free-2.svg
}
backend: Cloud server {
  icon: https://www.svgrepo.com/show/529862/server-path.svg
}
is_criminal_detected: Is Criminal? {
  shape: diamond
}

frontend: "Web application" {
  icon: https://www.svgrepo.com/show/455008/website.svg

  suspect_data_input: "Suspect Data Input"
  camera_feed_display: "Camera Feed Display"
  alert_system: "Criminal Match Alerts"
  criminal_record_display: "Criminal Record Display"
}

suspect -> frontend.suspect_data_input: features
iot -> frontend.camera_feed_display: headshot
frontend.suspect_data_input -> backend: suspect data
frontend.camera_feed_display -> backend: headshot
backend -> is_criminal_detected
is_criminal_detected -> frontend.alert_system: alert
is_criminal_detected -> frontend.criminal_record_display: criminal records
frontend.criminal_record_display -> official: criminal records
frontend.alert_system: alert
```
