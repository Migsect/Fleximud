"use strict";

require("./styles/creation.css");

const Utils = require("utils");
const $ = document.querySelector.bind(document);
const $$ = Utils.querySelectorAll;

/* Collapse and uncollapse */
$$(".attribute-item-children-expand").forEach(function(element)
{
    element.addEventListener("click", function()
    {
        const childList = element.parentNode.querySelector(".attribute-item-children-items");
        childList.classList.remove("hidden");

        const collapseButton = element.parentNode.querySelector(".attribute-item-children-collapse");
        element.classList.add("hidden");
        collapseButton.classList.remove("hidden");
    });
});
$$(".attribute-item-children-collapse").forEach(function(element)
{
    element.addEventListener("click", function()
    {
        const childList = element.parentNode.querySelector(".attribute-item-children-items");
        childList.classList.add("hidden");

        const collapseButton = element.parentNode.querySelector(".attribute-item-children-expand");
        element.classList.add("hidden");
        collapseButton.classList.remove("hidden");
    });
});

const remainingPointsElement = $(".attribute-selection-points-amount");

function refundPoints(amount)
{
    const remaining = Number(remainingPointsElement.dataset.remaining);
    remainingPointsElement.dataset.remaining = remaining + amount;
    remainingPointsElement.innerHTML = remainingPointsElement.dataset.remaining;
    return true;
}

function spendPoints(amount)
{
    const remaining = Number(remainingPointsElement.dataset.remaining);
    if (amount > remaining)
    {
        return false;
    }
    remainingPointsElement.dataset.remaining -= amount;
    remainingPointsElement.innerHTML = remainingPointsElement.dataset.remaining;

    return true;

}
$$(".attribute-item-points").forEach(function(element)
{
    const amountElement = element.querySelector(".attribute-item-points-amount");
    const amountAdd = element.querySelector(".attribute-item-points-add");
    const amountSubtract = element.querySelector(".attribute-item-points-subtract");

    function setAmount(amount)
    {
        amountElement.innerHTML = amount;
        element.dataset.amount = amount;
    }

    function getAmount()
    {
        return Number(element.dataset.amount);

    }

    function setCost(value)
    {
        element.dataset.cost = value;
    }

    function getCost()
    {
        return Number(element.dataset.cost);
    }

    amountAdd.addEventListener("click", function()
    {
        const cost = getCost();
        const result = spendPoints(cost);
        if (!result)
        {
            return;
        }
        setAmount(getAmount() + 1);
        setCost(getCost() + 1);

    });
    amountSubtract.addEventListener("click", function()
    {
        if (getAmount() <= 0)
        {
            return;
        }
        const refund = getCost() - 1;
        const result = refundPoints(refund);
        if (!result)
        {
            return;
        }
        setAmount(getAmount() - 1);
        setCost(getCost() - 1);

    });
});
