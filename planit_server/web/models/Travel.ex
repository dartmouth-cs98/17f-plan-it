defmodule PlanIt.Travel do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "travel" do
    belongs_to :card, PlanIt.Card

    field :type, :string
    field :duration, :time

    timestamps()
   end
end
