defmodule PlanIt.User do
  use PlanIt.Web, :model

  @primary_key {:id, :id, autogenerate: true}
  schema "user" do
    has_many :trip, PlanIt.Trip

    field :fname, :string
    field :lname, :string
    field :email, :string
    field :username, :string
    #field :birthday, :date

    timestamps()
  end
end
