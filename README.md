# K6 Testing Guide
This guide will help you understand how to use K6 for testing individual scripts nested inside other folders. It covers both local testing and using K6 Cloud.

## Prerequisites

- Install [K6](https://k6.io/docs/getting-started/installation/)
- Have a K6 Cloud account (optional for cloud testing)

## Folder Structure

Assume your project structure is as follows:
```
/home/<usename>/projects/tests/
├── verisafe(service1)
│   └── script1.js
├── chirp(service2)
│   └── script2.js
└── README.md
```

## Cloning the Repository

To clone the repository, use the following command:

```sh
git clone <repository-url>
cd tests
```

Replace `<repository-url>` with the actual URL of your repository.

## Running Tests Locally

To run a test locally, navigate to the folder containing your script and execute the following command:

```sh
k6 run /home/<username>/projects/tests/service1/script1.js
```

### Disclaimer

Local testing is suitable for development and small-scale tests. For large-scale or production-like testing, consider using K6 Cloud.

## Using K6 Cloud

### Login to K6 Cloud

First, log in to your K6 Cloud account:

```sh
k6 login cloud
```

Follow the prompts to authenticate.

### Running Tests on K6 Cloud

To run a test on K6 Cloud, use the following command:

```sh
k6 cloud /home/<username>/projects/tests/folder1/script1.js
```

This will upload your script to K6 Cloud and execute it there, providing you with detailed performance insights.

## Conclusion

By following this guide, you can efficiently run K6 tests both locally and on K6 Cloud. Choose the method that best fits your testing needs.