from rules import rule_engine
from model_predict import predict_fraud

def detect_transaction(transaction):

    rule_result = rule_engine(transaction)

    ml_result = predict_fraud(list(transaction.values()))

    if rule_result == "suspicious" or ml_result == 1:
        return "fraud"

    return "normal"