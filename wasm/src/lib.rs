use wasm_bindgen::prelude::*;
use jsonschema::{AsyncRetrieve, Uri};
use serde_json::{Value};

struct HttpRetriever;

#[cfg_attr(target_family = "wasm", async_trait::async_trait(?Send))]
#[cfg_attr(not(target_family = "wasm"), async_trait::async_trait)]
impl AsyncRetrieve for HttpRetriever {
    async fn retrieve(
        &self,
        uri: &Uri<String>,
    ) -> Result<Value, Box<dyn std::error::Error + Send + Sync>> {
        let x: reqwest::Response = reqwest::get(uri.as_str()).await?;
        x.json().await
            .map_err(Into::into)
    }
}

#[wasm_bindgen]
pub async fn validate(schema: &str, content: &str) -> Result<bool, String> {
    let json_schema = match serde_json::from_str::<Value>(schema) {
        Ok(s) => s,
        Err(e) => {
            println!("Schema parsing error: {}", e);
            return Err("Invalid schema".into());
        }
    };
    let json_content = match serde_json::from_str::<Value>(content) {
        Ok(c) => c,
        Err(e) => {
            println!("Content parsing error: {}", e);
            return Err("Invalid content".into());
        }
    };

    let validator_result = jsonschema::async_options()
        .with_retriever(HttpRetriever)
        .build(&json_schema)
        .await;

    let validator = match validator_result {
        Ok(v) => v,
        Err(e) => {
            println!("Schema compilation error: {}", e);
            return Err("Schema compilation failed".into());
        }
    };

    match validator.validate(&json_content) {
        Ok(_) => Ok(true),
        Err(error) => {
            println!("Validation error: {}", error);
            Err(error.to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[tokio::test]
    async fn it_works() {
        let schema = json!({"type": "string"});
        let content = json!("Hello world");
        let result = validate(&schema.to_string(), &content.to_string()).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), true);
    }

    #[tokio::test]
    async fn it_fails() {
        let schema = json!({"type": "string"});
        let content = json!(42);
        let result = validate(&schema.to_string(), &content.to_string()).await;
        assert!(result.is_err());
    }
}
