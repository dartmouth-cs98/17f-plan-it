defmodule PlanIt.Card do
  use PlanIt.Web, :model

  schema "card" do
    field :type, :string
    field :name, :string
    field :city, :string
    field :country, :string
    field :address, :string
    field :start_time, :datetime
    field :end_time, :datetime

    timestamps
  end
end



