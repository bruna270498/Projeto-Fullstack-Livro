package br.com.ibm.consulting.bootcamp.demospring.exception;

public class ErrorIdNotFoundException extends  RuntimeException{
    public ErrorIdNotFoundException(String message) {
        super(message);
    }
}
