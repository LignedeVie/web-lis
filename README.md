# LabResult.org Laboratory Information System

This is the Laboratory Information System (LIS) application for LabResult.org.

Features include:

- Create and manage laboratory orders and results
- Work with ~800 preset laboratory test fixtures, including RT-PCR (the primary
  method used to detect SARS-COV-2, the virus causing COVID-19)
- Manage patient profiles and records
- Invite patients to view results in the LabResult.org Patient Portal
- Create and configure custom laboratory tests and measures
- Configure whitelisted laboratory tests for sensitive tests such as HIV
- Three-step verification process for quality control of reports
- Authentication step before completing, verifying, and finalizing results
- Automated, configurable specimen tracking ID generation
- Specimen tracking report generation

## Project Setup

Make sure to install dependencies before running!

```sh
# install dependencies
yarn install
# start serving
yarn serve
```

One might find it much easier to develop if the `@labresultorg/web-plugins`
dependency were linked instead:

1. Clone the [LabResult.org web-plugins project](https://github.com/lab-result/web-plugins).
2. Change to the `web-plugins` directory and run `yarn link`.
3. Change back to the `web-lis` directory and run `yarn link @labresultorg/web-plugins`.
