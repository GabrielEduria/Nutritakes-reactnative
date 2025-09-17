import React, { useState } from "react";
import CredentialsScreen from "./register/CredentialsScreen";
import NameScreen from "./register/NameScreen";
import PhotoScreen from "./register/PhotoScreen";

export default function RegisterScreen() {
  const [step, setStep] = useState<"name" | "photo" | "credentials">("name");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {step === "name" && (
        <NameScreen
          onNext={(enteredName) => {
            setName(enteredName);
            setStep("photo");
          }}
        />
      )}
      {step === "photo" && (
        <PhotoScreen
          name={name}
          onNext={(selectedPhoto) => {
            setPhoto(selectedPhoto);
            setStep("credentials");
          }}
        />
      )}
      {step === "credentials" && (
        <CredentialsScreen
          name={name}
          photo={photo}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
    </>
  );
}
