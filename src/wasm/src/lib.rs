use serde_json::Value;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn validate(schema: &str, content: &str) -> Result<bool, String> {
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
    match jsonschema::validate(&json_schema, &json_content) {
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

    #[test]
    fn it_works() {
        let schema = json!({"type": "string"});
        let content = json!("Hello world");
        assert_eq!(
            validate(&schema.to_string(), &content.to_string()),
            Result::Ok(true)
        );
    }

    #[test]
    fn it_fails() {
        let schema = json!({"type": "string"});
        let content = json!(42);
        assert_eq!(
            validate(&schema.to_string(), &content.to_string()),
            Result::Err("42 is not of type \"string\"".to_string())
        );
    }
}
