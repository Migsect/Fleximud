"use strict";

require("./styles/creation.css");
const CreationPlugin = require("plugins/CreationPlugin");

const Utils = require("utils");
const $ = document.querySelector.bind(document);
const $$ = Utils.querySelectorAll;

class AttributesPlugin extends CreationPlugin
{
    onLoad()
    {
        const self = this;

        self.elements = {
            remainingPoints: $(".attribute-selection-points-amount")
        };

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
                const result = self.spendPoints(cost);
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
                const result = self.refundPoints(refund);
                if (!result)
                {
                    return;
                }
                setAmount(getAmount() - 1);
                setCost(getCost() - 1);

            });
        });
    }
    refundPoints(amount)
    {
        const self = this;
        const remaining = Number(self.elements.remainingPoints.dataset.remaining);
        self.elements.remainingPoints.dataset.remaining = remaining + amount;
        self.elements.remainingPoints.innerHTML = self.elements.remainingPoints.dataset.remaining;
        return true;
    }

    spendPoints(amount)
    {
        const self = this;
        const remaining = Number(self.elements.remainingPoints.dataset.remaining);
        if (amount > remaining)
        {
            return false;
        }
        self.elements.remainingPoints.dataset.remaining -= amount;
        self.elements.remainingPoints.innerHTML = self.elements.remainingPoints.dataset.remaining;

        return true;
    }

}

module.exports = AttributesPlugin;
