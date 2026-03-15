def rule_engine(transaction):

    amount = transaction["amount"]
    oldbalanceOrg = transaction["oldbalanceOrg"]
    newbalanceOrig = transaction["newbalanceOrig"]
    oldbalanceDest = transaction["oldbalanceDest"]
    newbalanceDest = transaction["newbalanceDest"]

    # Rule 1: Very high transaction amount
    if amount > 50000:
        return "suspicious"

    # Rule 2: Sender has no balance but tries to send money
    if oldbalanceOrg == 0 and amount > 10000:
        return "suspicious"

    # Rule 3: Balance mismatch (important fraud indicator)
    if oldbalanceOrg - amount != newbalanceOrig:
        return "suspicious"

    # Rule 4: Destination balance not updated correctly
    if newbalanceDest - oldbalanceDest != amount:
        return "suspicious"

    return "normal"