

## Random Forest candidate
Random Forest was evaluated independently from LightGBM using the same no-identity feature sets, frequency-encoded categoricals, 500 trees, and validation-selected depth. It did not beat LightGBM on both test AUC and Brier for either target, so model selection did not change and it is not in the production risk engine.

## Isolation Forest anomaly signal
Isolation Forest uses current numeric spending and trajectory features, train-only median imputation, and explicit missingness indicators. It is complementary rather than a classifier and is not blended into the headline risk score. Test anomaly rate was 8.48%; Pearson correlations with cost and schedule probabilities were 0.179 and -0.014.
