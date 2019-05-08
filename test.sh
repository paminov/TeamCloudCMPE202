#!/bin/bash

export STATUS=""
total=0
passed=0
failed=0
failed_log=""

function test_api()
{
	func=$1
	mock=$2
	export STATUS="pass"
	echo "Testing ${func}"
	cmd="serverless invoke --function ${func} --path mocks/${mock}"
	echo "Executing: ${cmd}"
	eval $cmd || {
		export STATUS="fail"
		echo "${func} test FAILED"
	}
}

test_api "listMenu" "list-menuItems.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	listMenu call Failed"
fi

test_api "cardCreate" "create-card.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	cardCreate call Failed"
fi

test_api "cardGet" "get-card.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	cardGet call Failed"
fi

test_api "cardUpdate" "update-card.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	cardUpdate call Failed"
fi

test_api "getCart" "get-cart.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	getCart call Failed"
fi

test_api "addItemToCart" "addto-cart.json"
test_api "addItemToCart" "addto-cart.json"
test_api "addItemToCart" "addto-cart.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	addItemToCart call Failed"
fi

test_api "removeItemFromCart" "delete-cart-item.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	removeItemFromCart call Failed"
fi

test_api "addToTransactions" "add-transactions.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	addToTransactions call Failed"
fi

test_api "getTransactions" "get-transactions.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	getTransactions call Failed"
fi

test_api "clearTransactions" "clear-transactions.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	clearTransactions call Failed"
fi

test_api "clearCart" "clear-cart.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	clearCart call Failed"
fi

test_api "cardDelete" "delete-card.json"
total=$(expr $total + 1)
if [ $STATUS == "pass" ]
then
	passed=$(expr $passed + 1)
else
	failed=$(expr $failed + 1)
	failed_log="$failed_log\n	cardDelete call Failed"
fi

echo -e "\nRESULTS: ${failed_log}\n"
echo "    TOTAL: ${total}, PASSED: ${passed}, FAILED: ${failed}"

