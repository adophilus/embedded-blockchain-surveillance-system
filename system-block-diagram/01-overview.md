https://playground.d2lang.com/?script=lJO9btswEMd3P8WNLQqGihQlsoYWrZd26uChY3CmThERihR4lAWjyLsXpmyLBtoinkTdkb__ffKBA_U1bOMXfq8AeOSBVKhhOx-iEUArZ2voQhi4lnKapjvev3ga3J1yveTOTbIs8uKxkCOTF2iCuD9eWQG8rQBc22ql0dTw83S6gZs9ZFkuB2e0IsGkRq_DQcz_PdpERrsYuN-TNgatIviOvpnQ0_vlHp6qh7KSnFCEwp48itYTiTzRa72zgWxTwy_aAQ6D0QqDdvYGubLMskpOtGMdKGHvUL1G9Ma4sQEmvyd_Q9XydfWYy_mZGDB0Kds49ao61LaGb5fz--FFUa2rUi6YhM3BeXyh2GmxidztbLoh-PunbF1IPbRsrqui-Vl53WuL5rmhQCpQU8MPhs3J-uWkwh0OVEOjsXe2ia-X6QbxeZ6VjrDhzoVr19LWljCMnnierWtf8vZsPF649O3sh08p5uSOEfwll3-keK18iKRUdNmvcx3Ak3K-SXbveO-y3V-9Jw7_Ubu00bqlqTG_ZHY65O7DObmPq7fVnwAAAP__&sketch=1&layout=elk&

```d2
system: System {
  suspect: Suspect {
    icon: https://www.svgrepo.com/show/532363/user-alt-1.svg
  }
  official: Official {
    icon: https://www.svgrepo.com/show/504002/police-security-policeman.svg
  }
  iot: Surveillance Hardware {
    icon: https://www.svgrepo.com/show/478458/surveillance-camera-free-2.svg
  }
  frontend: Web application {
    icon: https://www.svgrepo.com/show/455008/website.svg
  }
  backend: Cloud server {
    icon: https://www.svgrepo.com/show/529862/server-path.svg
  }
  blockchain: Blockchain {
    icon: https://www.svgrepo.com/show/338985/blockchain.svg
  }
  storage: Off-Chain Storage {
    icon: https://www.svgrepo.com/show/517093/ipfslite.svg
  }
  is_criminal_detected: Is Criminal? {
    shape: diamond
  }

  suspect -> iot: headshot
  suspect -> frontend: features
  iot -> frontend: headshot
  frontend -> backend: headshot + features
  backend -> is_criminal_detected
  is_criminal_detected -> frontend: yes
  frontend -> official: Criminal record
  official -> suspect: Arrest
  is_criminal_detected -> storage: no
  storage -> blockchain: hash(features)
}
```
