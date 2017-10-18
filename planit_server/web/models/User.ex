defmodule PlanIt.User do
  use PlanIt.Web, :model

  schema "user" do
    belongs_to :trip, PlanIt.Trip

    field :fname, :string
    field :lname, :string
    field :email, :string
    field :username, :string
    field :birthday, :utc_datetime

    timestamps()
  end
end
