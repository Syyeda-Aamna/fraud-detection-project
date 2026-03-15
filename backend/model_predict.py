import pickle

model = pickle.load(open("../fraud_model.pkl","rb"))

def predict_fraud(data):

    prediction = model.predict([data])

    return prediction[0]