https://playground.d2lang.com/?script=jJRBj9M-EMXv_hQj_6W_QNo2ZUuh9QEEhcMeECtx4FhN7EljbWobe9IIof3uKGnalNKg3uzJm_fGvzgpondMzij4TjlgCJXVyNY7-CUArPZOQckcksqypmmmab-NFPxU-12WSt9krxeL2WyZNZQny9Q-F88ir7x-0iVap-DjaX2r5Xy-XC0X2WDSuyb2EbekQH4tism6s_x2qMlbvRev3s5W88yGIlXDvDZtdLQ767DaGGLSTEaBfEiw7svvDwmpxEAKjMWdd0Y8C5Gjfur4yXXlawOJ4p7i7fPcr5Zv7rND1yQgl91IAgCD3ZAzwVvHCuSHxwf43G-lADDIuAnRa0rJuq0C-QkZ4fFUgf_hC7Iurdu2-oHmRnvnSLOPCuTZ21kfy0f7HBP9IT7CgC5q0MN_sPZ1ZSCnsxzwEXxRTLpNi-p412DyDnps04tTpjoF0tzF30FJaFLpWYpr8nObCxpipH7eMgLkR03xJxxvQzeIvMXuKrArZvACK6bokO2eXg7W18bp_E91MR7VCkfucKRUV5z-eYaR1l5EpqdwTXaGQIE8nTQxcn0R-vfIwwfdrggiNj0jW4DzfCI3cGrbhn-WxIoi92l3A-hI2keTpPgdAAD__w%3D%3D&

```d2
frontend: Web application {
  icon: https://www.svgrepo.com/show/455008/website.svg
}
blockchain: Blockchain {
  icon: https://www.svgrepo.com/show/338985/blockchain.svg
}
storage: "Off-Chain Storage" {
  icon: https://www.svgrepo.com/show/517093/ipfslite.svg
}
is_criminal_detected: "Is Criminal?" {
  shape: diamond
}

backend: "Cloud server" {
  icon: https://www.svgrepo.com/show/529862/server-path.svg

  api_endpoint: "API Endpoint"
  data_processing: "Data Processing & Matching"
  blockchain_connector: "Blockchain Connector"
  database_connector: "Criminal Data Connector"
}

frontend -> backend.api_endpoint: "suspect data, headshot"
backend.api_endpoint -> backend.data_processing
backend.data_processing -> backend.blockchain_connector: "query criminal data"
backend.data_processing -> backend.database_connector: "query criminal data (alternative)"
backend.blockchain_connector -> blockchain
backend.database_connector -> is_criminal_detected: "results"
backend.data_processing -> is_criminal_detected: "processed data"
is_criminal_detected -> backend: "criminal status"
backend.database_connector -> storage: "store raw data (if not criminal)"
backend -> frontend: "alert status, criminal records"
```
